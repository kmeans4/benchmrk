#!/usr/bin/env python3
"""
Scrape Hugging Face Models API for model metadata.
No API key required for basic usage.
"""

import requests
import json
from datetime import datetime
from typing import Optional, Dict, List, Any

BASE_URL = "https://huggingface.co/api/models"

def fetch_models(limit: int = 100, sort: str = "downloads", direction: str = -1) -> List[Dict[str, Any]]:
    """
    Fetch models from Hugging Face API.
    
    Args:
        limit: Number of models to fetch
        sort: Sort field (downloads, likes, lastModified, etc.)
        direction: -1 for descending, 1 for ascending
    
    Returns:
        List of model dictionaries
    """
    params = {
        "limit": limit,
        "sort": sort,
        "direction": direction,
        "full": "true",  # Get full model info
    }
    
    try:
        response = requests.get(BASE_URL, params=params, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching models: {e}")
        return []

def parse_model_data(hf_model: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parse Hugging Face model data into our schema format.
    """
    model_id = hf_model.get("modelId", "")
    
    # Extract provider from model ID (e.g., "meta-llama/Llama-3.1-8B" -> "meta-llama")
    provider = model_id.split("/")[0] if "/" in model_id else "Unknown"
    
    # Get pipeline_tag (task type)
    pipeline_tag = hf_model.get("pipeline_tag", "")
    
    # Get library info
    library_name = hf_model.get("library_name", "")
    
    # Extract parameter count from tags or config
    param_count = None
    tags = hf_model.get("tags", [])
    for tag in tags:
        if isinstance(tag, str) and "b" in tag.lower() and tag.replace(".", "").replace("b", "").isdigit():
            try:
                param_count = int(float(tag.lower().replace("b", "")) * 1e9)
                break
            except:
                pass
    
    # Get license info
    license_info = hf_model.get("license", "")
    
    # Determine license type
    license_type = "Unknown"
    if license_info:
        license_lower = license_info.lower()
        if "mit" in license_lower or "apache" in license_lower or "openrail" in license_lower:
            license_type = "OpenWeights"
        elif "proprietary" in license_lower:
            license_type = "Proprietary"
        elif "research" in license_lower:
            license_type = "ResearchOnly"
        elif "commercial" in license_lower:
            license_type = "CommercialAllowed"
    
    # Determine hosting type
    hosting_type = "Both" if license_type == "OpenWeights" else "CloudOnly"
    
    # Get modality from tags
    modalities = []
    for tag in tags:
        if isinstance(tag, str):
            tag_lower = tag.lower()
            if "text" in tag_lower:
                modalities.append("Text")
            elif "image" in tag_lower or "vision" in tag_lower:
                modalities.append("Image")
            elif "audio" in tag_lower or "speech" in tag_lower:
                modalities.append("Audio")
            elif "video" in tag_lower:
                modalities.append("Video")
            elif "code" in tag_lower:
                modalities.append("Code")
    
    # Default to text if no modality found
    if not modalities:
        modalities = ["Text"]
    
    # Remove duplicates
    modalities = list(set(modalities))
    
    # Get context window from config or tags (not always available)
    context_window = None
    config = hf_model.get("config", {})
    if config:
        max_position_embeddings = config.get("max_position_embeddings")
        if max_position_embeddings:
            context_window = max_position_embeddings
    
    # Get architecture
    architecture = None
    if config:
        architectures = config.get("architectures", [])
        if architectures:
            arch_str = architectures[0]
            if "MoE" in arch_str or "Mixtral" in arch_str:
                architecture = "MoE"
            elif "Dense" in arch_str:
                architecture = "Dense"
    
    # Get last modified date
    last_modified = hf_model.get("lastModified")
    if last_modified:
        try:
            release_date = datetime.fromisoformat(last_modified.replace("Z", "+00:00"))
        except:
            release_date = None
    else:
        release_date = None
    
    return {
        "name": model_id.split("/")[-1] if "/" in model_id else model_id,
        "provider": provider,
        "releaseDate": release_date.isoformat() if release_date else None,
        "contextWindow": context_window,
        "parameterCount": str(param_count) if param_count else None,
        "licenseType": license_type,
        "hostingType": hosting_type,
        "modalities": modalities,
        "architecture": architecture,
        "license": license_info,
        "tags": tags,
        "downloads": hf_model.get("downloads", 0),
        "likes": hf_model.get("likes", 0),
        "url": f"https://huggingface.co/{model_id}",
    }

def save_to_json(data: List[Dict[str, Any]], output_file: str = "huggingface_models.json"):
    """Save scraped data to JSON file."""
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved {len(data)} models to {output_file}")

def main():
    print("🤗 Scraping Hugging Face Models API...")
    
    # Fetch top models by downloads
    models = fetch_models(limit=100, sort="downloads")
    
    if not models:
        print("❌ No models fetched")
        return
    
    print(f"📦 Fetched {len(models)} models from API")
    
    # Parse models
    parsed_models = []
    for hf_model in models:
        try:
            parsed = parse_model_data(hf_model)
            parsed_models.append(parsed)
        except Exception as e:
            print(f"⚠️  Error parsing model {hf_model.get('modelId', 'Unknown')}: {e}")
    
    print(f"✅ Parsed {len(parsed_models)} models")
    
    # Save to JSON
    save_to_json(parsed_models)
    
    # Print summary
    print("\n📊 Summary:")
    print(f"   Total models: {len(parsed_models)}")
    providers = {}
    for m in parsed_models:
        providers[m["provider"]] = providers.get(m["provider"], 0) + 1
    print(f"   Providers: {providers}")

if __name__ == "__main__":
    main()
