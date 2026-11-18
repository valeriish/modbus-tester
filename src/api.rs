mod modbus;

use std::io::Write;
use std::net::TcpStream;

// Main router for all /api requests
pub fn handle_api_request(path: &str, method: &str, headers: &str, body: &str, stream: &mut TcpStream) {
    let has_json_content_type = headers.lines().any(|line| {
        let lower_line = line.to_lowercase();
        lower_line.starts_with("content-type:") && lower_line.contains("application/json")
    });
    if !has_json_content_type {
        let error_body = "{\"error\": \"Unsupported Media Type. Expected application/json\"}";
        let response = format!(
            "HTTP/1.1 415 Unsupported Media Type\r\nContent-Type: application/json\r\nContent-Length: {}\r\n\r\n{}",
            error_body.len(),
            error_body
        );
        let _ = stream.write_all(response.as_bytes());
        return;
    }
    let mut status_line = "HTTP/1.1 200 OK\r\n";
    let json_body: String;
    if path == "/api/modbus" && method == "POST" {
        match modbus::handle_modbus(body) {
            Ok(json) => json_body = json,
            Err(err_json) => {
                status_line = "HTTP/1.1 400 Bad Request\r\n";
                json_body = err_json;
            }
        };
    } else {
        status_line = "HTTP/1.1 404 Not Found\r\n";
        json_body = "{\"error\": \"API endpoint not found\"}".to_string();
    }
    let mut response = status_line.to_string();
    response.push_str("Content-Type: application/json\r\n");
    response.push_str(&format!("Content-Length: {}\r\n\r\n{}", json_body.len(), json_body));

    if let Err(e) = stream.write_all(response.as_bytes()) {
        eprintln!("Failed to write Modbus API response: {}", e);
    }
}
