import requests
import json
from typing import Optional, Dict, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

API_URL = "https://0xarchit-citytrack.hf.space"

class CityTrackAPIClient:
    def __init__(self, base_url: str = API_URL):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.access_token: Optional[str] = None

    def admin_login(self, email: str, password: str, expected_role: Optional[str] = "admin") -> Dict[str, Any]:
        try:
            payload: Dict[str, Any] = {
                "email": email,
                "password": password,
                "expected_role": expected_role,
            }
            response = self.session.post(
                f"{self.base_url}/admin/login",
                json=payload,
                headers={"Content-Type": "application/json"},
            )
            response.raise_for_status()
            data = response.json()
            token = data.get("access_token")
            if not token:
                return {"error": "Missing access_token", "response": data}
            self.access_token = token
            self.session.headers.update({"Authorization": f"Bearer {token}"})
            return data
        except Exception as e:
            logger.error(f"Admin login failed: {e}")
            return {"error": str(e)}
    
    def health_check(self) -> Dict[str, Any]:
        """Check API health status"""
        try:
            response = self.session.get(f"{self.base_url}/health/health")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {"status": "error", "message": str(e)}
    
    def get_issues(self, limit: int = 10, skip: int = 0) -> Dict[str, Any]:
        """Fetch all issues"""
        try:
            response = self.session.get(
                f"{self.base_url}/issues",
                params={"limit": limit, "skip": skip}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch issues: {e}")
            return {"error": str(e)}
    
    def get_issue_by_id(self, issue_id: str) -> Dict[str, Any]:
        """Fetch a specific issue"""
        try:
            response = self.session.get(f"{self.base_url}/issues/{issue_id}")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch issue {issue_id}: {e}")
            return {"error": str(e)}
    
    def create_issue(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new issue"""
        try:
            response = self.session.post(
                f"{self.base_url}/issues",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to create issue: {e}")
            return {"error": str(e)}
    
    def update_issue(self, issue_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing issue"""
        try:
            response = self.session.put(
                f"{self.base_url}/issues/{issue_id}",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to update issue {issue_id}: {e}")
            return {"error": str(e)}
    
    def get_departments(self) -> Dict[str, Any]:
        """Fetch all departments"""
        try:
            response = self.session.get(f"{self.base_url}/admin/departments")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch departments: {e}")
            return {"error": str(e)}

    def create_department(self, name: str, code: str, description: Optional[str] = None,
                          categories: Optional[str] = None, default_sla_hours: int = 48,
                          escalation_email: Optional[str] = None) -> Dict[str, Any]:
        try:
            payload: Dict[str, Any] = {
                "name": name,
                "code": code,
                "description": description,
                "categories": categories,
                "default_sla_hours": default_sla_hours,
                "escalation_email": escalation_email,
            }
            response = self.session.post(
                f"{self.base_url}/admin/departments",
                json=payload,
                headers={"Content-Type": "application/json"},
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to create department {code}: {e}")
            return {"error": str(e)}
    
    def get_workers(self, department_id: Optional[str] = None) -> Dict[str, Any]:
        """Fetch all workers or workers from a specific department"""
        try:
            params = {}
            if department_id:
                params["department_id"] = department_id
            
            response = self.session.get(
                f"{self.base_url}/admin/members",
                params=params
            )
            response.raise_for_status()
            data = response.json()
            if isinstance(data, list):
                return [m for m in data if isinstance(m, dict) and m.get("role") == "worker"]
            return data
        except Exception as e:
            logger.error(f"Failed to fetch workers: {e}")
            return {"error": str(e)}
    
    def get_worker_tasks(self) -> Dict[str, Any]:
        """Fetch tasks assigned to the current worker (from JWT)"""
        try:
            response = self.session.get(f"{self.base_url}/worker/tasks")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch worker tasks: {e}")
            return {"error": str(e)}
    
    def assign_issue_to_worker(self, issue_id: str, worker_id: str) -> Dict[str, Any]:
        """Assign an issue to a worker"""
        try:
            response = self.session.post(
                f"{self.base_url}/issues/{issue_id}/assign",
                json={"worker_id": worker_id},
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to assign issue: {e}")
            return {"error": str(e)}
    
    def resolve_issue(self, issue_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Mark an issue as resolved"""
        try:
            response = self.session.put(
                f"{self.base_url}/issues/{issue_id}/resolve",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to resolve issue {issue_id}: {e}")
            return {"error": str(e)}
    
    def get_issue_stats(self) -> Dict[str, Any]:
        """Get issue statistics"""
        try:
            response = self.session.get(f"{self.base_url}/admin/stats")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch stats: {e}")
            return {"error": str(e)}
    
    def get_heatmap_data(self, city: Optional[str] = None) -> Dict[str, Any]:
        """Get heatmap data for geospatial visualization"""
        try:
            params = {}
            if city:
                params["city"] = city
            
            response = self.session.get(
                f"{self.base_url}/admin/stats/heatmap",
                params=params
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch heatmap data: {e}")
            return {"error": str(e)}
    
    def create_worker(self, department_id: str, name: str, email: str, 
                     locality: str, city: str = "Himachal Pradesh", 
                     max_workload: int = 10, password: str = "12345678",
                     phone: Optional[str] = None, role: str = "worker") -> Dict[str, Any]:
        try:
            payload = {
                "department_id": department_id,
                "name": name,
                "email": email,
                "phone": phone,
                "role": role,
                "city": city,
                "locality": locality,
                "max_workload": max_workload,
                "password": password,
            }
            response = self.session.post(
                f"{self.base_url}/admin/members",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Failed to create worker {name}: {e}")
            return {"error": str(e)}
    
    def bulk_create_workers(self, department_code: str, department_id: str, 
                           worker_names: list, locations: list) -> Dict[str, Any]:
        """Bulk create workers with Gmail alias format: zrxarchit+<name>.<department>@gmail.com"""
        created_workers = []
        failed_workers = []
        
        if len(worker_names) != len(locations):
            return {"error": "Number of names and locations must match"}
        
        phone_prefix_by_department = {
            "PWD": "101",
            "SANITATION": "202",
            "TRAFFIC": "303",
        }

        for idx, name in enumerate(worker_names):
            location = locations[idx % len(locations)]
            name_parts = name.lower().replace(" ", ".")
            email = f"zrxarchit+{name_parts}.{department_code.lower()}@gmail.com"
            prefix = phone_prefix_by_department.get(department_code.upper(), "999")
            phone = f"9{prefix}{idx + 1:06d}"
            
            response = self.create_worker(
                department_id=department_id,
                name=name,
                email=email,
                locality=location,
                phone=phone,
                password="12345678",
                role="worker",
            )
            
            if "error" not in response:
                created_workers.append({
                    "name": name,
                    "email": email,
                    "locality": location,
                    "status": "created"
                })
                logger.info(f"✓ Created: {name} ({email}) - {location}")
            else:
                failed_workers.append({
                    "name": name,
                    "email": email,
                    "error": response.get("error")
                })
                logger.warning(f"✗ Failed: {name} ({email}) - {response.get('error')}")
        
        return {
            "department": department_code,
            "total": len(worker_names),
            "created": len(created_workers),
            "failed": len(failed_workers),
            "workers": created_workers,
            "failures": failed_workers
        }


def main():
    """Example usage of the API client"""
    print("=" * 80)
    print("CityTrack API Client - Worker Bulk Creation")
    print("=" * 80)
    print(f"Base URL: {API_URL}")
    print("=" * 80)
    
    client = CityTrackAPIClient()
    
    NEARBY_LOCATIONS = [
        "Una", "Haroli", "Amb", "Kasauli", "Baddi",
        "Nalagarh", "Solan", "Parwanoo", "Kalka", "Kurali"
    ]
    
    PWD_WORKERS = [
        "Ramesh Kumar", "Sukesh Singh", "Harish Patel", "Vikram Sharma", "Ajay Kumar",
        "Rajesh Tiwari", "Manoj Singh", "Arjun Verma", "Deepak Yadav", "Sandeep Gupta"
    ]
    
    SANITATION_WORKERS = [
        "Suresh Singh", "Mohan Lal", "Ravi Kumar", "Anita Devi", "Asha Sharma",
        "Priya Singh", "Meera Patel", "Kavya Reddy", "Neha Verma", "Pooja Kumari"
    ]
    
    TRAFFIC_WORKERS = [
        "Priya Sharma", "Anil Kumar", "Bhavna Singh", "Nitin Patel", "Sanjay Verma",
        "Rohit Sharma", "Dinesh Kumar", "Sachin Singh", "Amit Patel", "Vishal Reddy"
    ]
    
    print("\n[1] Health Check:")
    health = client.health_check()
    print(json.dumps(health, indent=2))

    print("\n[2] Admin Login:")
    login = client.admin_login(email="zrxarchit@gmail.com", password="12345678", expected_role="admin")
    if "error" in login:
        print(json.dumps(login, indent=2))
        return
    print(json.dumps({"token_type": login.get("token_type"), "user": login.get("user")}, indent=2))
    
    print("\n[3] Fetching Departments:")
    departments_response = client.get_departments()
    
    departments_map = {}
    if isinstance(departments_response, list):
        for dept in departments_response:
            departments_map[dept["code"]] = dept["id"]
            print(f"  - {dept['name']} (Code: {dept['code']}, ID: {dept['id']})")
    elif isinstance(departments_response, dict) and "departments" in departments_response:
        for dept in departments_response["departments"]:
            departments_map[dept["code"]] = dept["id"]
            print(f"  - {dept['name']} (Code: {dept['code']}, ID: {dept['id']})")
    else:
        print("  Error fetching departments:", departments_response)
        return
    
    if not departments_map:
        print("  No departments found. Creating baseline departments...")
        baseline = [
            ("Public Works Department", "PWD"),
            ("Sanitation Department", "SANITATION"),
            ("Traffic Department", "TRAFFIC"),
        ]
        for name, code in baseline:
            created = client.create_department(name=name, code=code)
            if "error" in created:
                print(json.dumps({"department": code, "result": created}, indent=2))

        departments_response = client.get_departments()
        departments_map = {}
        if isinstance(departments_response, list):
            for dept in departments_response:
                departments_map[dept["code"]] = dept["id"]
                print(f"  - {dept['name']} (Code: {dept['code']}, ID: {dept['id']})")
        elif isinstance(departments_response, dict) and "departments" in departments_response:
            for dept in departments_response["departments"]:
                departments_map[dept["code"]] = dept["id"]
                print(f"  - {dept['name']} (Code: {dept['code']}, ID: {dept['id']})")
        else:
            print("  Error fetching departments:", departments_response)
            return

        if not departments_map:
            print("  ERROR: Failed to create/fetch departments.")
            return
    
    print("\n[4] Creating PWD Workers (10 workers):")
    print("-" * 80)
    if "PWD" in departments_map:
        pwd_result = client.bulk_create_workers(
            department_code="PWD",
            department_id=departments_map["PWD"],
            worker_names=PWD_WORKERS,
            locations=NEARBY_LOCATIONS
        )
        print(json.dumps(pwd_result, indent=2))
    else:
        print("  ERROR: PWD department not found")
    
    print("\n[5] Creating Sanitation Workers (10 workers):")
    print("-" * 80)
    if "SANITATION" in departments_map:
        sanitation_result = client.bulk_create_workers(
            department_code="SANITATION",
            department_id=departments_map["SANITATION"],
            worker_names=SANITATION_WORKERS,
            locations=NEARBY_LOCATIONS
        )
        print(json.dumps(sanitation_result, indent=2))
    else:
        print("  ERROR: SANITATION department not found")
    
    print("\n[6] Creating Traffic Workers (10 workers):")
    print("-" * 80)
    if "TRAFFIC" in departments_map:
        traffic_result = client.bulk_create_workers(
            department_code="TRAFFIC",
            department_id=departments_map["TRAFFIC"],
            worker_names=TRAFFIC_WORKERS,
            locations=NEARBY_LOCATIONS
        )
        print(json.dumps(traffic_result, indent=2))
    else:
        print("  ERROR: TRAFFIC department not found")
    
    print("\n[7] Fetching All Workers:")
    workers = client.get_workers()
    if isinstance(workers, list):
        print(f"  Total workers: {len(workers)}")
        for worker in workers[:5]:
            print(f"    - {worker.get('name')} ({worker.get('email')})")
        if len(workers) > 5:
            print(f"    ... and {len(workers) - 5} more")
    else:
        print(json.dumps(workers, indent=2)[:500] + "...")
    
    print("\n" + "=" * 80)
    print("Bulk Worker Creation Complete!")
    print("=" * 80)


if __name__ == "__main__":
    main()
