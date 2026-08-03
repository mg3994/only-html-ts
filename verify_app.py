from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:8000/index.html")
    page.wait_for_timeout(2000)

    page.select_option("#locale-select", "ar")
    page.wait_for_timeout(1000)

    page.fill("#name-input", "سمير")
    page.wait_for_timeout(1000)

    page.click("button[data-val='100']")
    page.wait_for_timeout(1000)

    page.select_option("#locale-select", "hi")
    page.wait_for_timeout(1000)

    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        except Exception as e:
            print("Error occurred:", e)
        finally:
            context.close()
            browser.close()
