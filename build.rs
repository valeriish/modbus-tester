#[cfg(any(feature = "build-css", feature = "fetch-vue"))]
use std::path::Path;
#[cfg(any(feature = "build-css", feature = "fetch-vue"))]
use std::process::Command;

fn main() {
    println!("cargo:rerun-if-changed=build.rs");

    #[cfg(feature = "build-css")]
    build_tailwind();

    #[cfg(feature = "fetch-vue")]
    fetch_vue();
}

#[cfg(feature = "build-css")]
fn ensure_tailwind_binary() -> &'static str {
    // Select the standalone binary name and release asset for the host OS/arch
    let (bin_name, asset_name) = match (std::env::consts::OS, std::env::consts::ARCH) {
        ("linux", "x86_64") => ("tailwindcss", "tailwindcss-linux-x64"),
        ("linux", "aarch64") => ("tailwindcss", "tailwindcss-linux-arm64"),
        ("windows", "x86_64") => ("tailwindcss.exe", "tailwindcss-windows-x64.exe"),
        ("macos", "aarch64") => ("tailwindcss", "tailwindcss-macos-arm64"),
        ("macos", "x86_64") => ("tailwindcss", "tailwindcss-macos-x64"),
        (os, arch) => panic!("Unsupported OS/architecture for Tailwind CLI: {}-{}", os, arch),
    };

    if Path::new(bin_name).exists() {
        return bin_name;
    }

    let url = format!(
        "https://github.com/tailwindlabs/tailwindcss/releases/latest/download/{}",
        asset_name
    );

    // Download the standalone Tailwind CSS binary (-L follows GitHub release redirects)
    let status = Command::new("curl")
        .args(["-fsSL", &url, "-o", bin_name])
        .status()
        .expect("Failed to execute curl to download Tailwind CSS");

    if !status.success() {
        panic!("Failed to download Tailwind CSS binary from {}", url);
    }

    // Make the downloaded binary executable on Linux/WSL and macOS
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let mut perms = std::fs::metadata(bin_name)
            .expect("Failed to read Tailwind binary metadata")
            .permissions();
        perms.set_mode(0o755);
        std::fs::set_permissions(bin_name, perms)
            .expect("Failed to set executable permissions on Tailwind binary");
    }

    bin_name
}

#[cfg(feature = "build-css")]
fn build_tailwind() {
    println!("cargo:rerun-if-changed=src/app/input.css");
    println!("cargo:rerun-if-changed=static/");
    println!("cargo:rerun-if-changed=src/");

    let bin_name = ensure_tailwind_binary();

    // Execute the Tailwind CSS standalone binary
    let status = Command::new(Path::new(".").join(bin_name))
        .args(["-i", "src/app/input.css", "-o", "static/styles.css"])
        .status()
        .expect("Failed to execute Tailwind CSS binary");

    if !status.success() {
        panic!("Tailwind CSS build failed");
    }
}

#[cfg(feature = "fetch-vue")]
fn fetch_vue() {
    let dest = "static/vue.esm-browser.prod.js";
    if Path::new(dest).exists() {
        return;
    }

    // Download Vue 3.5.45 production ESM build for offline usage
    let status = Command::new("curl")
        .args([
            "-fsSL",
            "https://cdn.jsdelivr.net/npm/vue@3.5.45/dist/vue.esm-browser.prod.js",
            "-o",
            dest,
        ])
        .status()
        .expect("Failed to execute curl");

    if !status.success() {
        panic!("Failed to download Vue ESM bundle");
    }
}