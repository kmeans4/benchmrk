#!/usr/bin/env python3
"""
Scrape LMSys Chatbot Arena leaderboard for Elo ratings.
Note: This uses their public API which is undocumented but accessible.
"""

import requests
import json
from datetime import datetime
from typing import Dict, List, Any

# LMSys Arena API endpoints (undocumented but public)
ARENA_API_BASE = "https://chat.lmsys.org"
LEADERBOARD_ENDPOINT = f"{ARENA_API_BASE}/api/leaderboard"

def fetch_arena_leaderboard() -> List[Dict[str, Any]]:
    """
    Fetch the current Chatbot Arena leaderboard.
    Returns list of models with Elo ratings.
    """
    try:
        response = requests.get(LEADERBOARD_ENDPOINT, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        # The API returns different formats, handle common structures
        if isinstance(data, dict):
            return data.get("models", []) or data.get("leaderboard", []) or []
        elif isinstance(data, list):
            return data
        else:
            print(f"Unexpected response format: {type(data)}")
            return []
    
    except requests.RequestException as e:
        print(f"Error fetching LMSys leaderboard: {e}")
        return []

def parse_arena_data(model_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parse LMSys Arena model data into our schema format.
    """
    model_name = model_data.get("model", "") or model_data.get("name", "")
    
    # Get Elo rating
    elo = model_data.get("elo", 0)
    if isinstance(elo, str):
        try:
            elo = float(elo)
        except:
            elo = 0
    
    # Get confidence interval
    elo_lower = model_data.get("elo_lower", 0)
    elo_upper = model_data.get("elo_upper", 0)
    
    # Get vote counts
    votes = model_data.get("votes", 0)
    wins = model_data.get("wins", 0)
    losses = model_data.get("losses", 0)
    ties = model_data.get("ties", 0)
    
    # Get rank
    rank = model_data.get("rank", 0)
    
    # Get category (overall, hard, long context, etc.)
    category = model_data.get("category", "overall")
    
    # Determine license/hosting (LMSys mostly has cloud models)
    hosting_type = "CloudOnly"
    license_type = "Proprietary"
    
    # Check if it's an open model
    model_lower = model_name.lower()
    if "llama" in model_lower or "mistral" in model_lower or "deepseek" in model_lower:
        hosting_type = "Both"
        license_type = "OpenWeights"
    
    return {
        "name": model_name,
        "elo": elo,
        "elo_lower": elo_lower,
        "elo_upper": elo_upper,
        "votes": votes,
        "wins": wins,
        "losses": losses,
        "ties": ties,
        "rank": rank,
        "category": category,
        "hostingType": hosting_type,
        "licenseType": license_type,
        "source": "LMSys Chatbot Arena",
        "url": "https://chat.lmsys.org/leaderboard",
        "fetched_at": datetime.now().isoformat(),
    }

def save_to_json(data: Any, output_file: str):
    """Save scraped data to JSON file."""
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved to {output_file}")

def main():
    print("🏆 Scraping LMSys Chatbot Arena...")
    
    # Fetch leaderboard
    print("\n1. Fetching leaderboard...")
    raw_data = fetch_arena_leaderboard()
    
    if not raw_data:
        print("❌ No data fetched from LMSys API")
        print("   Note: LMSys API may have changed or be temporarily unavailable")
        print("   Alternative: Scrape the HTML leaderboard at https://chat.lmsys.org/leaderboard")
        return
    
    print(f"   Fetched {len(raw_data)} models")
    save_to_json(raw_data, "lmsys_raw.json")
    
    # Parse data
    print("\n2. Parsing model data...")
    parsed_models = []
    for model in raw_data:
        try:
            parsed = parse_arena_data(model)
            parsed_models.append(parsed)
        except Exception as e:
            print(f"⚠️  Error parsing model: {e}")
    
    print(f"   Parsed {len(parsed_models)} models")
    save_to_json(parsed_models, "lmsys_leaderboard.json")
    
    # Print summary
    print("\n📊 Summary:")
    print(f"   Total models: {len(parsed_models)}")
    
    if parsed_models:
        top_model = parsed_models[0] if parsed_models[0].get("rank", 1) == 1 else min(parsed_models, key=lambda x: x.get("rank", 999))
        print(f"   Top model: {top_model.get('name', 'Unknown')} (Elo: {top_model.get('elo', 0)})")
        
        elo_range = [m.get("elo", 0) for m in parsed_models if m.get("elo", 0) > 0]
        if elo_range:
            print(f"   Elo range: {min(elo_range):.1f} - {max(elo_range):.1f}")

if __name__ == "__main__":
    main()
