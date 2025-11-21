use image::{DynamicImage, ImageFormat, ImageReader};
use std::io::Cursor;
use std::path::Path;
use sha2::{Sha256, Sha512, Digest};
use md5::Md5;
use rand::Rng;
use rand::distributions::Alphanumeric;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(serde::Serialize)]
struct ImageInfo {
    width: u32,
    height: u32,
    format: String,
}

#[tauri::command]
fn get_image_info(file_path: String) -> Result<ImageInfo, String> {
    let img = ImageReader::open(&file_path)
        .map_err(|e| e.to_string())?
        .decode()
        .map_err(|e| e.to_string())?;

    let format = Path::new(&file_path)
        .extension()
        .and_then(|s| s.to_str())
        .unwrap_or("unknown")
        .to_uppercase();

    Ok(ImageInfo {
        width: img.width(),
        height: img.height(),
        format,
    })
}

#[derive(serde::Deserialize)]
struct ResizeOptions {
    width: Option<u32>,
    height: Option<u32>,
    percentage: Option<f32>,
    maintain_aspect: bool,
}

#[tauri::command]
fn resize_image(
    input_path: String,
    output_path: String,
    options: ResizeOptions,
) -> Result<ImageInfo, String> {
    let img = ImageReader::open(&input_path)
        .map_err(|e| e.to_string())?
        .decode()
        .map_err(|e| e.to_string())?;

    let (orig_width, orig_height) = (img.width(), img.height());

    let (new_width, new_height) = if let Some(percentage) = options.percentage {
        let scale = percentage / 100.0;
        (
            (orig_width as f32 * scale) as u32,
            (orig_height as f32 * scale) as u32,
        )
    } else if options.maintain_aspect {
        if let Some(width) = options.width {
            let ratio = width as f32 / orig_width as f32;
            (width, (orig_height as f32 * ratio) as u32)
        } else if let Some(height) = options.height {
            let ratio = height as f32 / orig_height as f32;
            ((orig_width as f32 * ratio) as u32, height)
        } else {
            (orig_width, orig_height)
        }
    } else {
        (
            options.width.unwrap_or(orig_width),
            options.height.unwrap_or(orig_height),
        )
    };

    let resized = img.resize(new_width, new_height, image::imageops::FilterType::Lanczos3);

    // Determine output format from file extension
    let output_format = get_image_format_from_path(&output_path)?;

    resized
        .save_with_format(&output_path, output_format)
        .map_err(|e| e.to_string())?;

    Ok(ImageInfo {
        width: new_width,
        height: new_height,
        format: format!("{:?}", output_format),
    })
}

#[tauri::command]
fn convert_image_format(
    input_path: String,
    output_path: String,
) -> Result<ImageInfo, String> {
    let img = ImageReader::open(&input_path)
        .map_err(|e| e.to_string())?
        .decode()
        .map_err(|e| e.to_string())?;

    let output_format = get_image_format_from_path(&output_path)?;

    img.save_with_format(&output_path, output_format)
        .map_err(|e| e.to_string())?;

    Ok(ImageInfo {
        width: img.width(),
        height: img.height(),
        format: format!("{:?}", output_format),
    })
}

fn get_image_format_from_path(path: &str) -> Result<ImageFormat, String> {
    let ext = Path::new(path)
        .extension()
        .and_then(|s| s.to_str())
        .ok_or_else(|| "Invalid file extension".to_string())?
        .to_lowercase();

    match ext.as_str() {
        "jpg" | "jpeg" => Ok(ImageFormat::Jpeg),
        "png" => Ok(ImageFormat::Png),
        "gif" => Ok(ImageFormat::Gif),
        "webp" => Ok(ImageFormat::WebP),
        "bmp" => Ok(ImageFormat::Bmp),
        "ico" => Ok(ImageFormat::Ico),
        "tiff" | "tif" => Ok(ImageFormat::Tiff),
        _ => Err(format!("Unsupported format: {}", ext)),
    }
}

// UUID Generator
#[tauri::command]
fn generate_uuid_v4() -> String {
    uuid::Uuid::new_v4().to_string()
}

#[tauri::command]
fn generate_uuid_v7() -> String {
    uuid::Uuid::now_v7().to_string()
}

// Hash Generator
#[tauri::command]
fn generate_hash(text: String, algorithm: String) -> Result<String, String> {
    match algorithm.to_lowercase().as_str() {
        "md5" => {
            let mut hasher = Md5::new();
            hasher.update(text.as_bytes());
            Ok(format!("{:x}", hasher.finalize()))
        }
        "sha256" => {
            let mut hasher = Sha256::new();
            hasher.update(text.as_bytes());
            Ok(format!("{:x}", hasher.finalize()))
        }
        "sha512" => {
            let mut hasher = Sha512::new();
            hasher.update(text.as_bytes());
            Ok(format!("{:x}", hasher.finalize()))
        }
        _ => Err(format!("Unsupported algorithm: {}", algorithm)),
    }
}

// Password Generator
#[derive(serde::Deserialize)]
struct PasswordOptions {
    length: usize,
    include_uppercase: bool,
    include_lowercase: bool,
    include_numbers: bool,
    include_symbols: bool,
}

#[tauri::command]
fn generate_password(options: PasswordOptions) -> Result<String, String> {
    if options.length < 4 {
        return Err("Password length must be at least 4 characters".to_string());
    }

    if !options.include_uppercase
        && !options.include_lowercase
        && !options.include_numbers
        && !options.include_symbols
    {
        return Err("At least one character type must be selected".to_string());
    }

    let mut charset = String::new();
    if options.include_uppercase {
        charset.push_str("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }
    if options.include_lowercase {
        charset.push_str("abcdefghijklmnopqrstuvwxyz");
    }
    if options.include_numbers {
        charset.push_str("0123456789");
    }
    if options.include_symbols {
        charset.push_str("!@#$%^&*()_+-=[]{}|;:,.<>?");
    }

    let charset_chars: Vec<char> = charset.chars().collect();
    let mut rng = rand::thread_rng();

    let password: String = (0..options.length)
        .map(|_| {
            let idx = rng.gen_range(0..charset_chars.len());
            charset_chars[idx]
        })
        .collect();

    Ok(password)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_image_info,
            resize_image,
            convert_image_format,
            generate_uuid_v4,
            generate_uuid_v7,
            generate_hash,
            generate_password
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
