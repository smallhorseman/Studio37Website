from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By

def analyze_on_page_seo(url):
    driver = None
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")

    try:
        driver_path = ChromeDriverManager().install()
        driver = webdriver.Chrome(service=Service(driver_path), options=chrome_options)
        
        # FIX: Add a page load timeout to prevent indefinite hangs
        driver.set_page_load_timeout(20) # 20 seconds

        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
            
        driver.get(url)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        title_tag = soup.find('title')
        title_text = title_tag.get_text(strip=True) if title_tag else 'No title tag found'
        
        meta_desc_tag = soup.find('meta', attrs={'name': 'description'})
        meta_desc_text = meta_desc_tag['content'].strip() if meta_desc_tag and meta_desc_tag.has_attr('content') else 'No meta description found'
        
        h1_tags = [h1.get_text(strip=True) for h1 in soup.find_all('h1')]
        
        return {
            'title': {'text': title_text, 'length': len(title_text)},
            'metaDescription': {'text': meta_desc_text, 'length': len(meta_desc_text)},
            'h1': {'tags': h1_tags, 'count': len(h1_tags)},
        }

    except TimeoutException:
        return {'error': "Timed out waiting for the page to load."}
    except Exception as e:
        return {'error': f"An unexpected error occurred: {e}"}
    finally:
        if driver:
            driver.quit()