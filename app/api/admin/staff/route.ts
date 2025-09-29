import { NextRequest, NextResponse } from 'next/server';

// Mock database
const staffDB = {
  employees: [
    {
      id: 'emp1',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@laxmione.com',
      phone: '+91-9876543210',
      department: 'Operations',
      role: 'Operations Manager',
      joinDate: '2022-03-15',
      status: 'active',
      performance: 92,
      attendance: 96,
      avatar: null,
      salary: 75000,
      leaves: { taken: 8, remaining: 14 }
    },
    {
      id: 'emp2',
      name: 'Priya Sharma',
      email: 'priya.sharma@laxmione.com',
      phone: '+91-9876543211',
      department: 'Technology',
      role: 'Senior Developer',
      joinDate: '2021-06-20',
      status: 'active',
      performance: 88,
      attendance: 94,
      avatar: null,
      salary: 95000,
      leaves: { taken: 5, remaining: 17 }
    },
    {
      id: 'emp3',
      name: 'Amit Patel',
      email: 'amit.patel@laxmione.com',
      phone: '+91-9876543212',
      department: 'Marketing',
      role: 'Marketing Head',
      joinDate: '2020-01-10',
      status: 'active',
      performance: 85,
      attendance: 92,
      avatar: null,
      salary: 85000,
      leaves: { taken: 10, remaining: 12 }
    },
    {
      id: 'emp4',
      name: 'Neha Gupta',
      email: 'neha.gupta@laxmione.com',
      phone: '+91-9876543213',
      department: 'Human Resources',
      role: 'HR Manager',
      joinDate: '2021-11-05',
      status: 'active',
      performance: 90,
      attendance: 98,
      avatar: null,
      salary: 70000,
      leaves: { taken: 3, remaining: 19 }
    },
    {
      id: 'emp5',
      name: 'Vikram Singh',
      email: 'vikram.singh@laxmione.com',
      phone: '+91-9876543214',
      department: 'Legal & Compliance',
      role: 'Legal Advisor',
      joinDate: '2022-08-12',
      status: 'on-leave',
      performance: 87,
      attendance: 90,
      avatar: null,
      salary: 80000,
      leaves: { taken: 15, remaining: 7 }
    }
  ],
  performance: {
    metrics: [
      { month: 'Jan', average: 85 },
      { month: 'Feb', average: 87 },
      { month: 'Mar', average: 86 },
      { month: 'Apr', average: 88 },
      { month: 'May', average: 90 },
      { month: 'Jun', average: 89 }
    ],
    topPerformers: [
      { id: 'emp1', name: 'Rajesh Kumar', score: 92 },
      { id: 'emp4', name: 'Neha Gupta', score: 90 },
      { id: 'emp2', name: 'Priya Sharma', score: 88 }
    ]
  },
  attendance: {
    today: {
      present: 42,
      absent: 3,
      onLeave: 5,
      total: 50
    },
    monthly: {
      averageAttendance: 94,
      workingDays: 22,
      holidays: 2
    }
  },
  departments: [
    { name: 'Operations', count: 15 },
    { name: 'Technology', count: 12 },
    { name: 'Marketing', count: 8 },
    { name: 'Human Resources', count: 6 },
    { name: 'Legal & Compliance', count: 4 },
    { name: 'Finance', count: 5 }
  ]
};

// GET - Fetch staff data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';
    const department = searchParams.get('department');
    const status = searchParams.get('status');

    let responseData: any = {};

    switch (type) {
      case 'employees':
        let employees = [...staffDB.employees];

        if (department) {
          employees = employees.filter(e => e.department === department);
        }

        if (status) {
          employees = employees.filter(e => e.status === status);
        }

        responseData.employees = employees;
        break;

      case 'performance':
        responseData.performance = staffDB.performance;
        break;

      case 'attendance':
        responseData.attendance = staffDB.attendance;
        break;

      case 'departments':
        responseData.departments = staffDB.departments;
        break;

      case 'summary':
        responseData = {
          totalEmployees: staffDB.employees.length,
          activeEmployees: staffDB.employees.filter(e => e.status === 'active').length,
          departments: staffDB.departments.length,
          averagePerformance: staffDB.employees.reduce((sum, e) => sum + e.performance, 0) / staffDB.employees.length,
          todayAttendance: staffDB.attendance.today,
          topPerformers: staffDB.performance.topPerformers
        };
        break;

      default:
        responseData = staffDB;
    }

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Staff fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff data' },
      { status: 500 }
    );
  }
}

// POST - Add new staff member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newEmployee = {
      id: `emp_${Date.now()}`,
      ...body,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      performance: 0,
      attendance: 100,
      avatar: null,
      leaves: { taken: 0, remaining: 22 }
    };

    staffDB.employees.push(newEmployee);

    // Update department count
    const dept = staffDB.departments.find(d => d.name === body.department);
    if (dept) {
      dept.count++;
    }

    return NextResponse.json({
      success: true,
      employee: newEmployee
    });

  } catch (error) {
    console.error('Staff creation error:', error);
    return NextResponse.json(
      { error: 'Failed to add staff member' },
      { status: 500 }
    );
  }
}

// PUT - Update staff member
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    const employeeIndex = staffDB.employees.findIndex(e => e.id === id);
    if (employeeIndex === -1) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    staffDB.employees[employeeIndex] = {
      ...staffDB.employees[employeeIndex],
      ...updates
    };

    return NextResponse.json({
      success: true,
      employee: staffDB.employees[employeeIndex]
    });

  } catch (error) {
    console.error('Staff update error:', error);
    return NextResponse.json(
      { error: 'Failed to update staff member' },
      { status: 500 }
    );
  }
}

// DELETE - Remove staff member
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Employee ID required' },
        { status: 400 }
      );
    }

    const employeeIndex = staffDB.employees.findIndex(e => e.id === id);
    if (employeeIndex === -1) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    const employee = staffDB.employees[employeeIndex];
    staffDB.employees.splice(employeeIndex, 1);

    // Update department count
    const dept = staffDB.departments.find(d => d.name === employee.department);
    if (dept && dept.count > 0) {
      dept.count--;
    }

    return NextResponse.json({
      success: true,
      message: 'Employee removed successfully'
    });

  } catch (error) {
    console.error('Staff deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to remove staff member' },
      { status: 500 }
    );
  }
}