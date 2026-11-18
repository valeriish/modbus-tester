mod api;

use std::fs;
use std::net::{TcpListener, TcpStream};
use std::io::{Read, Write};

fn get_content_type(path: &str) -> &str {
    if path.ends_with(".css") {
        "text/css"
    } else if path.ends_with(".js") {
        "application/javascript"
    } else {
        "text/html"
    }
}

fn handle_client(mut stream: TcpStream) {
    let mut buffer = [0; 1024];

    if let Err(e) = stream.read(&mut buffer) {
        eprintln!("Failed to read from connection: {}", e);
        return;
    }

    let request_str = String::from_utf8_lossy(&buffer);
    let mut parts = request_str.splitn(2, "\r\n\r\n");
    let headers_part = parts.next().unwrap_or("");
    let body_part = parts.next().unwrap_or("").trim_matches(char::from(0));
    let mut first_line = headers_part.lines().next().unwrap_or("").split_whitespace();
    let method = first_line.next().unwrap_or("");
    let path = first_line.next().unwrap_or("");

    if path.starts_with("/api") {
        api::handle_api_request(path, method, headers_part, body_part, &mut stream);
        return;
    }

    // If local Vue bundle is missing on disk, redirect browser to CDN
    if path == "/vue.esm-browser.prod.js"
        && !std::path::Path::new("static/vue.esm-browser.prod.js").exists()
    {
        let response = "HTTP/1.1 302 Found\r\n\
                        Location: https://cdn.jsdelivr.net/npm/vue@3.5.45/dist/vue.esm-browser.prod.js\r\n\
                        Content-Length: 0\r\n\r\n";
        let _ = stream.write_all(response.as_bytes());
        return;
    }

    let file_path = if path == "/" {
        "static/index.html".to_string()
    } else {
        format!("static{}", path)
    };

    match fs::read_to_string(&file_path) {
        Ok(contents) => {
            let content_type = get_content_type(&file_path);
            let mut response = "HTTP/1.1 200 OK\r\n".to_string();
            response.push_str(&format!("Content-type: {}\r\n", content_type));
            response.push_str(&format!("Content-Length: {}\r\n", contents.len()));
            response.push_str(&format!("\n\r\n{}", contents));

            if let Err(e) = stream.write_all(response.as_bytes()) {
                eprintln!("Failed to write response: {}", e);
            }
        }
        Err(_) => {
            // File not found -> return 404
            let body = "<h1>404 Not Found</h1>";
            let response = format!(
                "HTTP/1.1 404 NOT FOUND\r\nContent-Type: text/html\r\nContent-Length: {}\r\n\r\n{}",
                body.len(),
                body
            );
            let _ = stream.write_all(response.as_bytes());
        }
    }
}

fn main() -> std::io::Result<()> {
    let listener = TcpListener::bind("127.0.0.1:9000")?;
    println!("Server is running on http://127.0.0.1:9000");

    for stream in listener.incoming() {
        match stream {
            Ok(s) => handle_client(s),
            Err(e) => eprintln!("Failed to establish a connection: {}", e),
        }
    }
    Ok(())
}