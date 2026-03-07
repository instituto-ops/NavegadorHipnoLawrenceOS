import re

def modify_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    for old, new in replacements:
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

modify_file('apps/backend/agent/jules.py', [
    ('audit_parser = subparsers.add_parser("audit-ads", help="Audit visibility across specific Google Ads pages")', 'subparsers.add_parser("audit-ads", help="Audit visibility across specific Google Ads pages")')
])

modify_file('apps/backend/analytics/__init__.py', [
    ('from .ga4_service import ga4_service\nfrom .ads_service import ads_service\nfrom .gbp_service import gbp_service\nfrom .wordpress_service import wp_service\nfrom .n8n_service import n8n_service\nfrom .instagram_service import instagram_service\nfrom .pagespeed_service import pagespeed_service\n', '__all__ = ["ga4_service", "ads_service", "gbp_service", "wp_service", "n8n_service", "instagram_service", "pagespeed_service"]\n\nfrom .ga4_service import ga4_service\nfrom .ads_service import ads_service\nfrom .gbp_service import gbp_service\nfrom .wordpress_service import wp_service\nfrom .n8n_service import n8n_service\nfrom .instagram_service import instagram_service\nfrom .pagespeed_service import pagespeed_service\n')
])

modify_file('apps/backend/analytics/gbp_service.py', [
    ("service = build('businessprofileperformance', 'v1', credentials=creds)", "build('businessprofileperformance', 'v1', credentials=creds)"),
    ('location_name = f"locations/{self.location_id}"', '')
])

modify_file('apps/backend/lam/executor.py', [
    ('        except:', '        except Exception:')
])

modify_file('apps/backend/lam/orchestrator.py', [
    ('            except:', '            except Exception:')
])

modify_file('apps/backend/main.py', [
    ('                    except:', '                    except Exception:'),
    ('if current_task: current_task.cancel()', 'if current_task:\n            current_task.cancel()')
])
