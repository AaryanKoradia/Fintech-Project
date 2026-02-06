import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime
from typing import List, Dict
import os
import re

class GovernmentSchemesScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        })
        self.data_dir = os.path.join(os.path.dirname(__file__), 'scraped_schemes')
        os.makedirs(self.data_dir, exist_ok=True)
        
    def get_page(self, url: str) -> BeautifulSoup:
        try:
            print(f"Fetching: {url}")
            response = self.session.get(url, timeout=30, allow_redirects=True)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            print(f"Error: {e}")
            return None
    
    def scrape_myscheme_homepage(self) -> List[Dict]:
        schemes = []
        url = "https://www.myscheme.gov.in"
        
        soup = self.get_page(url)
        if not soup:
            return schemes
        
        all_links = soup.find_all('a', href=True)
        for link in all_links:
            href = link.get('href', '')
            text = link.get_text(strip=True)
            
            if len(text) > 10 and any(word in text.lower() for word in ['scheme', 'yojana', 'benefit', 'subsidy']):
                schemes.append({
                    'name': text,
                    'url': href if href.startswith('http') else url + href,
                    'source': 'myScheme.gov.in'
                })
        
        return schemes
    
    def scrape_vikaspedia(self) -> List[Dict]:
        schemes = []
        base_url = "https://www.pib.gov.in/indexm.aspx?reg=3&lang=2"
        
        scheme_urls = [
            f"{base_url}/social-welfare/central-government-schemes",
            f"{base_url}/social-welfare/state-government-schemes",
            f"{base_url}/agriculture/policies-and-schemes",
        ]
        
        for url in scheme_urls:
            soup = self.get_page(url)
            if not soup:
                continue
            
            for link in soup.find_all('a', href=True):
                text = link.get_text(strip=True)
                href = link.get('href', '')
                
                if len(text) > 15 and 'scheme' in text.lower():
                    full_url = href if href.startswith('http') else base_url + href
                    schemes.append({
                        'name': text,
                        'url': full_url,
                        'source': 'Vikaspedia',
                        'category': 'Government Scheme'
                    })
            
            time.sleep(1)  # Be polite
        
        return schemes
    
    def scrape_india_gov(self) -> List[Dict]:
        """Scrape schemes from India.gov.in"""
        schemes = []
        base_url = "https://www.india.gov.in"
        
        # Try different scheme listing pages
        urls_to_try = [
            f"{base_url}/spotlight/schemes",
            f"{base_url}/topics/social-development",
        ]
        
        for url in urls_to_try:
            soup = self.get_page(url)
            if not soup:
                continue
            
            # Find scheme information
            for link in soup.find_all('a', href=True):
                text = link.get_text(strip=True)
                
                if len(text) > 20 and any(keyword in text.lower() for keyword in ['scheme', 'programme', 'mission', 'yojana']):
                    schemes.append({
                        'name': text,
                        'url': link.get('href'),
                        'source': 'India.gov.in'
                    })
            
            time.sleep(1)
        
        return schemes
    
    def scrape_sample_schemes(self) -> List[Dict]:
        """
        Return a curated list of major Indian government schemes
        This is a fallback when scraping doesn't work
        """
        print("📋 Using curated list of major government schemes...")
        
        schemes = [
            {
                "name": "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
                "description": "Financial inclusion program for providing universal access to banking facilities",
                "ministry": "Ministry of Finance",
                "category": "Financial Inclusion",
                "eligibility": ["Indian citizens", "No minimum balance requirement"],
                "benefits": ["Free bank account", "RuPay debit card", "Overdraft facility up to ₹10,000", "Accidental insurance cover of ₹2 lakh"],
                "source": "Government of India"
            },
            {
                "name": "Pradhan Mantri Awas Yojana (PMAY)",
                "description": "Housing for All - providing affordable housing to the urban and rural poor",
                "ministry": "Ministry of Housing and Urban Affairs",
                "category": "Housing",
                "eligibility": ["EWS/LIG/MIG categories", "Family should not own a pucca house"],
                "benefits": ["Interest subsidy on home loans", "Direct financial assistance", "Credit-linked subsidy"],
                "source": "Government of India"
            },
            {
                "name": "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
                "description": "World's largest health insurance scheme providing coverage up to ₹5 lakh per family per year",
                "ministry": "Ministry of Health and Family Welfare",
                "category": "Healthcare",
                "eligibility": ["Bottom 40% poor and vulnerable families", "Based on SECC 2011 database"],
                "benefits": ["Health cover of ₹5 lakh per family per year", "Cashless treatment at empaneled hospitals", "Coverage for pre and post-hospitalization"],
                "source": "Government of India"
            },
            {
                "name": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
                "description": "Direct income support to farmers",
                "ministry": "Ministry of Agriculture and Farmers Welfare",
                "category": "Agriculture",
                "eligibility": ["Small and marginal farmers", "Land holding up to 2 hectares"],
                "benefits": ["₹6,000 per year in three equal installments", "Direct bank transfer"],
                "source": "Government of India"
            },
            {
                "name": "Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)",
                "description": "Provide at least 100 days of wage employment in a financial year to rural households",
                "ministry": "Ministry of Rural Development",
                "category": "Employment",
                "eligibility": ["Rural households", "Adult members willing to do unskilled manual work"],
                "benefits": ["Guaranteed 100 days of employment", "Minimum wage payment", "Work within 5 km of residence"],
                "source": "Government of India"
            },
            {
                "name": "Pradhan Mantri Mudra Yojana (PMMY)",
                "description": "Funding for micro-enterprises and small businesses",
                "ministry": "Ministry of Finance",
                "category": "Business & Employment",
                "eligibility": ["Non-corporate, non-farm small/micro enterprises", "Loan up to ₹10 lakh"],
                "benefits": ["Loans under three categories: Shishu (up to ₹50,000), Kishore (₹50,001 to ₹5 lakh), Tarun (₹5,00,001 to ₹10 lakh)"],
                "source": "Government of India"
            },
            {
                "name": "Beti Bachao Beti Padhao",
                "description": "Scheme to save and educate the girl child",
                "ministry": "Ministry of Women and Child Development",
                "category": "Women Empowerment",
                "eligibility": ["Girl child", "Parents/guardians"],
                "benefits": ["Awareness campaigns", "Educational support", "Prevention of gender-based sex selection"],
                "source": "Government of India"
            },
            {
                "name": "Sukanya Samriddhi Yojana",
                "description": "Small deposit scheme for girl child",
                "ministry": "Ministry of Finance",
                "category": "Savings Scheme",
                "eligibility": ["Girl child below 10 years", "Parents/guardians can open account"],
                "benefits": ["High interest rate (currently around 7.6%)", "Tax benefits under Section 80C", "Maturity after 21 years or marriage after 18 years"],
                "source": "Government of India"
            },
            {
                "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                "description": "Crop insurance scheme for farmers",
                "ministry": "Ministry of Agriculture and Farmers Welfare",
                "category": "Agriculture Insurance",
                "eligibility": ["All farmers growing notified crops"],
                "benefits": ["Comprehensive risk coverage", "Low premium rates", "Use of technology for quick claim settlement"],
                "source": "Government of India"
            },
            {
                "name": "Atal Pension Yojana (APY)",
                "description": "Pension scheme for unorganized sector workers",
                "ministry": "Ministry of Finance",
                "category": "Pension",
                "eligibility": ["Citizens aged 18-40 years", "Not covered by any statutory social security scheme"],
                "benefits": ["Guaranteed minimum pension of ₹1,000 to ₹5,000 per month", "Government co-contribution for eligible subscribers"],
                "source": "Government of India"
            },
            {
                "name": "National Social Assistance Programme (NSAP)",
                "description": "Social security for elderly, widows and disabled",
                "ministry": "Ministry of Rural Development",
                "category": "Social Security",
                "eligibility": ["Senior citizens above 60 years", "Widows", "Persons with disabilities"],
                "benefits": ["Monthly pension", "Financial assistance to BPL families"],
                "source": "Government of India"
            },
            {
                "name": "Stand Up India Scheme",
                "description": "Facilitate bank loans for SC/ST and women entrepreneurs",
                "ministry": "Ministry of Finance",
                "category": "Entrepreneurship",
                "eligibility": ["SC/ST and/or women entrepreneurs", "Setting up greenfield enterprise"],
                "benefits": ["Loans between ₹10 lakh to ₹1 crore", "Handholding support"],
                "source": "Government of India"
            },
            {
                "name": "Pradhan Mantri Ujjwala Yojana (PMUY)",
                "description": "Free LPG connections to women from BPL households",
                "ministry": "Ministry of Petroleum and Natural Gas",
                "category": "Energy",
                "eligibility": ["BPL households", "Women members of the family"],
                "benefits": ["Free LPG connection", "Financial assistance for first refill and stove"],
                "source": "Government of India"
            },
            {
                "name": "Swachh Bharat Mission",
                "description": "Clean India Mission for sanitation and cleanliness",
                "ministry": "Ministry of Jal Shakti",
                "category": "Sanitation",
                "eligibility": ["All households", "Urban and rural areas"],
                "benefits": ["Financial assistance for toilet construction", "Awareness campaigns", "Solid waste management"],
                "source": "Government of India"
            },
            {
                "name": "National Education Policy 2020",
                "description": "Transforming India's education system",
                "ministry": "Ministry of Education",
                "category": "Education",
                "eligibility": ["All students", "Educational institutions"],
                "benefits": ["Universal access to education", "Holistic development", "Flexibility in curriculum"],
                "source": "Government of India"
            }
        ]
        
        return schemes
        
        return schemes
    
    def enrich_scheme_details(self, scheme: Dict) -> Dict:
        """Try to get more details about a scheme if URL is available"""
        if not scheme.get('url') or scheme.get('description'):
            return scheme
        
        soup = self.get_page(scheme['url'])
        if not soup:
            return scheme
        
        try:
            # Try to extract description
            desc_elem = soup.find(['div', 'p'], class_=lambda x: x and 'description' in x.lower() if x else False)
            if desc_elem:
                scheme['description'] = desc_elem.get_text(strip=True)[:500]
            
            # Extract any list items (might be benefits or eligibility)
            lists = soup.find_all(['ul', 'ol'])
            all_items = []
            for ul in lists[:3]:  # First 3 lists only
                items = [li.get_text(strip=True) for li in ul.find_all('li')]
                all_items.extend(items)
            
            if all_items and not scheme.get('benefits'):
                scheme['benefits'] = all_items[:10]  # First 10 items
                
        except Exception as e:
            print(f"⚠️ Could not enrich {scheme.get('name')}: {e}")
        
        return scheme
    
    def save_to_json(self, data: List[Dict], filename: str):
        """Save scraped data to JSON file"""
        filepath = os.path.join(self.data_dir, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"💾 Saved {len(data)} schemes to {filepath}")
        return filepath
    
    def run_full_scrape(self, use_curated: bool = False):
        """
        Main scraping workflow - tries multiple sources
        """
        print("\n" + "="*60)
        print("🇮🇳 Government Schemes Scraper Started")
        print("="*60 + "\n")
        
        all_schemes = []
        
        # If user wants curated list immediately
        if use_curated:
            all_schemes = self.scrape_sample_schemes()
        else:
            # Try scraping from multiple sources
            sources = [
                ("myScheme.gov.in", self.scrape_myscheme_homepage),
                ("Vikaspedia", self.scrape_vikaspedia),
                ("India.gov.in", self.scrape_india_gov),
            ]
            
            for source_name, scraper_func in sources:
                print(f"\n📡 Trying {source_name}...")
                try:
                    schemes = scraper_func()
                    if schemes:
                        print(f"✅ Found {len(schemes)} schemes from {source_name}")
                        all_schemes.extend(schemes)
                    else:
                        print(f"⚠️ No schemes found from {source_name}")
                except Exception as e:
                    print(f"❌ Error with {source_name}: {e}")
                
                time.sleep(2)  # Be polite between sources
            
            # If no schemes found, use curated list
            if not all_schemes:
                print("\n⚠️ No schemes scraped from websites.")
                print("📋 Using curated list of major government schemes...\n")
                all_schemes = self.scrape_sample_schemes()
        
        # Save results
        if all_schemes:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filepath = self.save_to_json(all_schemes, f'schemes_{timestamp}.json')
            
            # Create summary
            summary = {
                'total_schemes': len(all_schemes),
                'sources': list(set([s.get('source', 'Unknown') for s in all_schemes])),
                'categories': list(set([s.get('category', 'Unknown') for s in all_schemes if s.get('category')])),
                'ministries': list(set([s.get('ministry', 'Unknown') for s in all_schemes if s.get('ministry')])),
                'scraped_at': datetime.now().isoformat(),
            }
            self.save_to_json([summary], f'summary_{timestamp}.json')
            
            print("\n" + "="*60)
            print(f"✅ Complete! Found {len(all_schemes)} schemes")
            print(f"📁 Saved to: {filepath}")
            print("="*60 + "\n")
        
        return all_schemes


def main():
    """
    Run the scraper
    """
    scraper = GovernmentSchemesScraper()
    
    print("Choose scraping mode:")
    print("1. Try scraping from websites (may not work)")
    print("2. Use curated list of 15 major government schemes (recommended)")
    
    # For automation, default to curated list
    choice = input("\nEnter choice (1/2) or press Enter for option 2: ").strip()
    
    use_curated = choice != "1"
    
    schemes = scraper.run_full_scrape(use_curated=use_curated)
    
    # Print sample
    if schemes:
        print("\n📊 Sample Scheme:")
        print(json.dumps(schemes[0], indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
