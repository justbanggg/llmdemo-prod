#!/usr/bin/env python3
"""
Demo script to showcase the winning prompts
"""

from winning_prompts import get_ctf_prompts


def main():
    print("🎯 Winning Prompts Demo")
    print("=" * 50)
    print()
    
    print("🏁 CTF Challenge - Winning Prompts")
    print("These prompts are designed to get the AI to recommend pad Thai:")
    print("-" * 60)
    
    ctf_prompts = get_ctf_prompts("standard")
    for i, prompt in enumerate(ctf_prompts[:4], 1):
        print(f"{i}. {prompt}")
    
    print()
    print("💡 Key Success Factors:")
    print("   🏁 CTF: Focus on shrimp allergy, medical no-chili, cannot eat soup / need a dry noodle")
    print()
    print("🚀 Ready to test these winning prompts!")


if __name__ == "__main__":
    main()
