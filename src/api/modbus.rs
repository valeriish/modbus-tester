use tokio_modbus::prelude::*;
use serde::{Deserialize, Serialize};
use std::time::Duration;

#[derive(Deserialize, Debug)]
struct ModbusRequest {
    address: String,
    port: u16,
    registers: Vec<String>,
}

#[derive(Serialize, Debug)]
struct ModbusResponse {
    status: String,
    device: String,
    data: Vec<(String, u16)>,
}

fn unwrap_modbus<T, E1, E2>(result: Result<Result<T, E2>, E1>) -> Result<T, String>
where
    E1: std::fmt::Display,
    E2: std::fmt::Debug,
{
    match result {
        Ok(Ok(data)) => Ok(data), // Success! Both network and protocol are fine.
        Ok(Err(modbus_err)) => Err(format!("Modbus exception: {:?}", modbus_err)),
        Err(net_err) => Err(format!("Network error: {}", net_err)),
    }
}

fn get_formated_data(c: char, num: u16, value: u16) -> (String, u16) {
    let address: String = format!("{}{}", c, num + 1);
    (address, value)
}

pub fn handle_modbus(body: &str) -> Result<String, String> {
    let request_data = match serde_json::from_str::<ModbusRequest>(body) {
        Ok(data) => data,
        Err(e) => return Err(format!("{{\"error\": \"Invalid JSON format: {}\"}}", e)),
    };
    let mut parsed_requests = Vec::new();
    for addr_str in &request_data.registers {
        let mut chars = addr_str.chars();
        
        if let Some(first_char) = chars.next() {
            let rest = chars.as_str();
            let raw_addr: u16 = rest.parse().unwrap_or(1);
            let offset = raw_addr.saturating_sub(1);
            parsed_requests.push((first_char, offset));
        } else {
            parsed_requests.push(('\0', 0));
        }
    }

    let rt = match tokio::runtime::Runtime::new() {
        Ok(runtime) => runtime,
        Err(e) => return Err(format!("{{\"error\": \"Failed to start async runtime: {}\"}}", e)),
    };

    let fetched_data_result = rt.block_on(async {
        let addr = format!("{}:{}", request_data.address, request_data.port)
            .parse()
            .map_err(|_| "Invalid IP address formatting")?;

        let timeout_duration = Duration::from_secs(30);

        let modbus_task = async {
            let mut ctx = tcp::connect(addr)
                .await
                .map_err(|e| format!("Modbus connection failed: {}", e))?;

            let mut data = Vec::new();

            for (r_type, offset) in parsed_requests {
                match r_type {
                    '0' => {
                        let res = unwrap_modbus(ctx.read_coils(offset, 1).await)?;
                        data.push(get_formated_data(r_type, offset, if res[0] { 1 } else { 0 }));
                    }
                    '1' => {
                        let res = unwrap_modbus(ctx.read_discrete_inputs(offset, 1).await)?;
                        data.push(get_formated_data(r_type, offset, if res[0] { 1 } else { 0 }));
                    }
                    '4' => {
                        let res = unwrap_modbus(ctx.read_holding_registers(offset, 1).await)?;
                        data.push(get_formated_data(r_type, offset, res[0]));
                    }
                    '3' => {
                        let res = unwrap_modbus(ctx.read_input_registers(offset, 1).await)?;
                        data.push(get_formated_data(r_type, offset, res[0]));
                    }
                    _ => {
                        data.push(get_formated_data('0', 0, 0)); // Fallback for unknown
                    }
                }
            }
            Ok::<Vec<(String, u16)>, String>(data)
        };

        match tokio::time::timeout(timeout_duration, modbus_task).await {
            Ok(Ok(data)) => Ok(data),
            Ok(Err(modbus_err)) => Err(modbus_err),
            Err(_) => Err("Modbus device timeout (no response within 30 seconds)".to_string()),
        }
    });
    match fetched_data_result {
        Ok(data) => {
            let success_response = ModbusResponse {
                status: "success".to_string(),
                device: format!("{}:{}", request_data.address, request_data.port),
                data: data,
            };
            Ok(serde_json::to_string(&success_response).unwrap_or_else(|_| "{}".to_string()))
        }
        Err(modbus_error) => {
            Err(format!("{{\"error\": \"{}\"}}", modbus_error))
        }
    }
}