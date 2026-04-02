#!/usr/bin/env python3
"""
Scrape PapersWithCode leaderboards for benchmark scores.
Free API access with rate limits.
"""

import requests
import json
from datetime import datetime
from typing import Optional, Dict, List, Any

BASE_URL = "https://paperswithcode.com/api/v1"

def fetch_leaderboards(task_name: Optional[str] = None, limit: int = 100) -> List[Dict[str, Any]]:
    """
    Fetch leaderboards from PapersWithCode API.
    
    Args:
        task_name: Filter by task name (e.g., "question-answering")
        limit: Maximum number of leaderboards to fetch
    
    Returns:
        List of leaderboard dictionaries
    """
    endpoint = f"{BASE_URL}/leaderboards/"
    params = {"limit": limit}
    
    if task_name:
        params["task"] = task_name
    
    try:
        response = requests.get(endpoint, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        return data.get("results", [])
    except requests.RequestException as e:
        print(f"Error fetching leaderboards: {e}")
        return []

def fetch_tasks() -> List[Dict[str, Any]]:
    """
    Fetch all available tasks from PapersWithCode.
    """
    endpoint = f"{BASE_URL}/tasks/"
    params = {"limit": 100}
    
    try:
        response = requests.get(endpoint, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        return data.get("results", [])
    except requests.RequestException as e:
        print(f"Error fetching tasks: {e}")
        return []

def fetch_leaderboard_details(leaderboard_id: str) -> Optional[Dict[str, Any]]:
    """
    Fetch detailed information for a specific leaderboard.
    """
    endpoint = f"{BASE_URL}/leaderboards/{leaderboard_id}/"
    
    try:
        response = requests.get(endpoint, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching leaderboard details: {e}")
        return None

def parse_leaderboard_data(lb_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parse leaderboard data into our schema format.
    """
    # Extract benchmark name
    name = lb_data.get("name", "Unknown")
    
    # Get task info
    task = lb_data.get("task", {})
    task_name = task.get("name", "") if isinstance(task, dict) else str(task)
    
    # Get evaluation metrics
    metrics = lb_data.get("evaluation_field", {})
    metric_name = metrics.get("name", "Accuracy") if isinstance(metrics, dict) else str(metrics)
    
    # Determine score type
    score_type = "Accuracy"
    metric_lower = metric_name.lower()
    if "pass" in metric_lower:
        score_type = "PassAtK"
    elif "elo" in metric_lower:
        score_type = "Elo"
    elif "percentage" in metric_lower or "%" in metric_lower:
        score_type = "Percentage"
    elif "bleu" in metric_lower or "rouge" in metric_lower:
        score_type = "Raw"
    
    # Get URL
    url = lb_data.get("url", "")
    if not url and lb_data.get("id"):
        url = f"https://paperswithcode.com/leaderboard/{lb_data['id']}"
    
    # Get submission count (approximate model count)
    submission_count = lb_data.get("num_submissions", 0)
    
    return {
        "name": name,
        "category": task_name,
        "description": lb_data.get("description", ""),
        "scoreType": score_type,
        "scoreInterpretation": "higher=better",
        "sourceUrl": url,
        "leaderboardUrl": url,
        "modelCount": submission_count,
        "paperswithcode_id": lb_data.get("id", ""),
    }

def fetch_benchmark_scores(leaderboard_id: str) -> List[Dict[str, Any]]:
    """
    Fetch scores for a specific leaderboard.
    Returns list of {model_name, score, rank, ...}
    """
    endpoint = f"{BASE_URL}/leaderboards/{leaderboard_id}/"
    
    try:
        response = requests.get(endpoint, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        # Extract submissions/results
        submissions = data.get("results", [])
        
        parsed_scores = []
        for submission in submissions:
            # Get model name
            model_name = submission.get("model_name", "")
            if not model_name:
                # Try to get from paper or other field
                paper = submission.get("paper", {})
                model_name = paper.get("title", "") if isinstance(paper, dict) else ""
            
            if not model_name:
                continue
            
            # Get score
            score_value = submission.get("score", 0)
            if isinstance(score_value, dict):
                # Sometimes score is a dict with metric name as key
                score_value = next(iter(score_value.values()), 0)
            
            # Get rank
            rank = submission.get("rank", 0)
            
            # Get submission date
            submission_date = submission.get("date", "")
            
            parsed_scores.append({
                "model_name": model_name,
                "score": float(score_value) if score_value else 0,
                "rank": rank,
                "submission_date": submission_date,
                "method_name": submission.get("method_name", ""),
            })
        
        return parsed_scores
    
    except requests.RequestException as e:
        print(f"Error fetching scores for {leaderboard_id}: {e}")
        return []

def save_to_json(data: Any, output_file: str):
    """Save scraped data to JSON file."""
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved to {output_file}")

def main():
    print("📚 Scraping PapersWithCode API...")
    
    # Fetch available tasks
    print("\n1. Fetching tasks...")
    tasks = fetch_tasks()
    print(f"   Found {len(tasks)} tasks")
    save_to_json(tasks, "paperswithcode_tasks.json")
    
    # Fetch leaderboards
    print("\n2. Fetching leaderboards...")
    leaderboards = fetch_leaderboards(limit=50)
    print(f"   Found {len(leaderboards)} leaderboards")
    
    # Parse leaderboards
    parsed_leaderboards = []
    for lb in leaderboards:
        try:
            parsed = parse_leaderboard_data(lb)
            parsed_leaderboards.append(parsed)
        except Exception as e:
            print(f"⚠️  Error parsing leaderboard: {e}")
    
    save_to_json(parsed_leaderboards, "paperswithcode_leaderboards.json")
    
    # Fetch scores for top leaderboards
    print("\n3. Fetching scores for top leaderboards...")
    all_scores = {}
    for lb in leaderboards[:10]:  # Limit to top 10 for now
        lb_id = lb.get("id", "")
        if lb_id:
            print(f"   Fetching scores for {lb.get('name', lb_id)}...")
            scores = fetch_benchmark_scores(lb_id)
            if scores:
                all_scores[lb_id] = scores
                print(f"      ✅ Got {len(scores)} scores")
    
    save_to_json(all_scores, "paperswithcode_scores.json")
    
    # Print summary
    print("\n📊 Summary:")
    print(f"   Tasks: {len(tasks)}")
    print(f"   Leaderboards: {len(parsed_leaderboards)}")
    print(f"   Score datasets: {len(all_scores)}")
    total_scores = sum(len(scores) for scores in all_scores.values())
    print(f"   Total scores: {total_scores}")

if __name__ == "__main__":
    main()
