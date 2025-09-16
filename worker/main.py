#!/usr/bin/env python3
"""
Web Automation Workflow Worker
Hệ thống worker linh hoạt để thực thi các workflow tự động hóa web
sử dụng Strategy Pattern và State Pattern với Playwright.
"""

import asyncio
import argparse
import sys
from pathlib import Path
from core.workflow_manager import WorkflowManager

# Proxy settings mẫu
SAMPLE_PROXY_SETTINGS = {
    "server": "http://proxy.example.com:8080",
    "username": "proxy_user",
    "password": "proxy_pass"
}

async def main():
    """Entry point chính của ứng dụng."""
    parser = argparse.ArgumentParser(
        description="Web Automation Workflow Worker",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ví dụ sử dụng:
  python main.py --load-dir workflows_json --run-all
  python main.py --load workflows_json/sample.json --run sample
  python main.py --load-dir workflows_json --list --status
  python main.py --load-dir workflows_json --run-pending --max-concurrent 3
        """
    )
    
    # Tùy chọn tải workflow
    parser.add_argument(
        '--load', '-l',
        type=str,
        help='Tải một workflow từ file JSON cụ thể'
    )
    
    parser.add_argument(
        '--load-dir', '-d',
        type=str,
        default='workflows_json',
        help='Tải tất cả workflow từ thư mục (mặc định: workflows_json)'
    )
    
    # Tùy chọn thực thi
    parser.add_argument(
        '--run', '-r',
        type=str,
        help='Chạy một workflow cụ thể theo tên'
    )
    
    parser.add_argument(
        '--run-all', '-ra',
        action='store_true',
        help='Chạy tất cả workflow có thể chạy được'
    )
    
    parser.add_argument(
        '--run-pending', '-rp',
        action='store_true',
        help='Chỉ chạy các workflow ở trạng thái Pending'
    )
    
    parser.add_argument(
        '--run-multiple', '-rm',
        type=str,
        nargs='+',
        help='Chạy nhiều workflow cụ thể (cách nhau bởi dấu cách)'
    )
    
    # Tùy chọn quản lý
    parser.add_argument(
        '--list', '-ls',
        action='store_true',
        help='Liệt kê tất cả workflow đã tải'
    )
    
    parser.add_argument(
        '--status', '-s',
        action='store_true',
        help='Hiển thị trạng thái tổng quan của WorkflowManager'
    )
    
    parser.add_argument(
        '--reset',
        type=str,
        help='Reset một workflow về trạng thái Pending'
    )
    
    parser.add_argument(
        '--reset-all',
        action='store_true',
        help='Reset tất cả workflow về trạng thái Pending'
    )
    
    # Tùy chọn cấu hình
    parser.add_argument(
        '--max-concurrent', '-mc',
        type=int,
        default=5,
        help='Số workflow tối đa chạy đồng thời (mặc định: 5)'
    )
    
    parser.add_argument(
        '--use-proxy',
        action='store_true',
        help='Sử dụng proxy settings mẫu cho tất cả workflow'
    )
    
    parser.add_argument(
        '--headless',
        action='store_true',
        help='Chạy browser ở chế độ headless (ẩn)'
    )

    args = parser.parse_args()
    
    # Tạo WorkflowManager
    print("🚀 Khởi tạo Workflow Manager...")
    manager = WorkflowManager(max_concurrent_workflows=args.max_concurrent)
    
    # Chuẩn bị proxy settings
    proxy_settings = SAMPLE_PROXY_SETTINGS if args.use_proxy else None
    if proxy_settings:
        print("🌐 Sử dụng proxy settings cho tất cả workflow")
    
    try:
        # Tải workflow
        if args.load:
            # Tải từ file cụ thể
            workflow_path = Path(args.load)
            if not workflow_path.exists():
                print(f"❌ File không tồn tại: {workflow_path}")
                return 1
            
            manager.load_workflow(workflow_path, proxy_settings)
            
        else:
            # Tải từ thư mục
            workflows_dir = Path(args.load_dir)
            if workflows_dir.exists():
                manager.load_workflows_from_directory(workflows_dir, proxy_settings)
            else:
                print(f"⚠️ Thư mục không tồn tại: {workflows_dir}")
                print("💡 Tạo thư mục và thêm file JSON workflow để bắt đầu")
        
        # Xử lý các lệnh quản lý workflow
        if args.reset:
            if manager.reset_workflow(args.reset):
                print(f"✅ Đã reset workflow: {args.reset}")
            return 0
        
        if args.reset_all:
            manager.reset_all_workflows()
            return 0
        
        # Hiển thị thông tin
        if args.list:
            workflows = manager.list_workflows()
            if workflows:
                print(f"\n📋 Danh sách {len(workflows)} workflow:")
                for i, wf_info in enumerate(workflows, 1):
                    status_icon = {
                        'Pending': '⏳',
                        'Running': '🔄', 
                        'Completed': '✅',
                        'Failed': '❌'
                    }.get(wf_info['state'], '❓')
                    
                    proxy_info = " (proxy)" if wf_info['has_proxy'] else ""
                    exec_time = f" [{wf_info['execution_time']:.2f}s]" if wf_info['execution_time'] else ""
                    
                    print(f"   {i:2d}. {status_icon} {wf_info['name']}: {wf_info['state']}{proxy_info}{exec_time}")
                    print(f"       Nodes: {wf_info['node_count']}, Có thể chạy: {'Có' if wf_info['can_run'] else 'Không'}")
            else:
                print("📭 Chưa có workflow nào được tải")
        
        if args.status:
            manager.print_status()
        
        # Thực thi workflow
        results = {}
        
        if args.run:
            # Chạy một workflow cụ thể
            result = await manager.run_workflow_by_name(args.run)
            results[args.run] = result
            
        elif args.run_multiple:
            # Chạy nhiều workflow
            results = await manager.run_multiple_workflows(args.run_multiple)
            
        elif args.run_pending:
            # Chỉ chạy workflow Pending
            results = await manager.run_all_pending_workflows()
            
        elif args.run_all:
            # Chạy tất cả workflow có thể chạy
            results = await manager.run_all_runnable_workflows()
        
        # Báo cáo kết quả
        if results:
            print(f"\n🏁 Báo cáo kết quả thực thi:")
            successful = sum(1 for success in results.values() if success)
            total = len(results)
            
            for name, success in results.items():
                status = "✅ Thành công" if success else "❌ Thất bại"
                print(f"   - {name}: {status}")
            
            print(f"\n📊 Tổng kết: {successful}/{total} workflow thành công")
            
            if successful < total:
                return 1  # Có workflow thất bại
        
        # Hiển thị trạng thái cuối
        if not args.list and not args.status and results:
            manager.print_status()
        
        return 0
        
    except KeyboardInterrupt:
        print("\n⏹️ Đã dừng bởi người dùng")
        return 130
    
    except Exception as e:
        print(f"❌ Lỗi không mong đợi: {e}")
        return 1

def create_sample_workflow():
    """Tạo file workflow mẫu nếu chưa tồn tại."""
    workflows_dir = Path("workflows_json")
    sample_file = workflows_dir / "sample_workflow.json"
    
    if sample_file.exists():
        return
    
    workflows_dir.mkdir(exist_ok=True)
    
    sample_workflow = {
        "nodes": [
            {
                "id": "start_1",
                "type": "start",
                "x": 100,
                "y": 100,
                "params": {},
                "displayName": "Bắt đầu"
            },
            {
                "id": "goto_1", 
                "type": "goto",
                "x": 300,
                "y": 100,
                "params": {
                    "url": "https://example.com"
                },
                "displayName": "Điều hướng đến Example.com"
            },
            {
                "id": "wait_1",
                "type": "wait",
                "x": 500,
                "y": 100,
                "params": {
                    "timeout": 2000
                },
                "displayName": "Chờ 2 giây"
            },
            {
                "id": "stop_1",
                "type": "stop",
                "x": 700,
                "y": 100,
                "params": {},
                "displayName": "Kết thúc"
            }
        ],
        "connections": [
            {
                "fromNode": "start_1",
                "fromPort": "out", 
                "toNode": "goto_1",
                "toPort": "in"
            },
            {
                "fromNode": "goto_1",
                "fromPort": "out",
                "toNode": "wait_1",
                "toPort": "in"
            },
            {
                "fromNode": "wait_1",
                "fromPort": "out",
                "toNode": "stop_1",
                "toPort": "in"
            }
        ]
    }
    
    with open(sample_file, 'w', encoding='utf-8') as f:
        import json
        json.dump(sample_workflow, f, ensure_ascii=False, indent=2)
    
    print(f"📝 Đã tạo workflow mẫu: {sample_file}")

if __name__ == "__main__":
    # Tạo workflow mẫu nếu cần
    create_sample_workflow()
    
    # Chạy ứng dụng chính
    sys.exit(asyncio.run(main()))