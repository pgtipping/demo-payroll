# MVP User Testing Checklist

## Test Environment Setup

- [ ] Development server running on localhost:3000
- [ ] Test admin account created
- [ ] Test employee account created
- [ ] Clear browser cache/cookies before testing

## 1. Authentication Testing

### Admin Login

- [ ] Can access login page
- [ ] Can login with admin credentials
- [ ] Redirects to admin dashboard
- [ ] Session persists after page refresh
- [ ] Can logout successfully

### Employee Login

- [ ] Can access login page
- [ ] Can login with employee credentials
- [ ] Redirects to employee dashboard
- [ ] Session persists after page refresh
- [ ] Can logout successfully

## 2. Employee Management (Admin)

### Employee List

- [ ] Can view list of all employees
- [ ] List shows correct employee information
- [ ] Can sort/filter employees
- [ ] Employee count matches expected

### Employee Creation

- [ ] Can access 'Add Employee' form
- [ ] Can fill all required fields
- [ ] Employee ID generates automatically
- [ ] Receives success confirmation
- [ ] New employee appears in list

### Employee Updates

- [ ] Can access employee edit form
- [ ] Can modify employee details
- [ ] Changes save correctly
- [ ] Updates reflect immediately

## 3. Payroll Processing (Admin)

### Monthly Payroll

- [ ] Can initiate monthly payroll
- [ ] System calculates correct gross pay
- [ ] Tax calculations are accurate
- [ ] Deductions apply correctly
- [ ] Net pay calculations match expected

### Payslip Generation

- [ ] Can generate individual payslips
- [ ] PDF format is correct
- [ ] All payment details present
- [ ] Can batch generate payslips
- [ ] Can download generated PDFs

## 4. Employee Self-Service

### Profile Management

- [ ] Can view personal profile
- [ ] Can update basic information
- [ ] Changes save successfully
- [ ] History of changes visible

### Payslip Access

- [ ] Can view list of payslips
- [ ] Can view individual payslip details
- [ ] Can download payslip PDFs
- [ ] YTD totals calculate correctly

### Dashboard

- [ ] Shows correct personal information
- [ ] Displays latest payslip
- [ ] Shows YTD earnings
- [ ] Quick actions work correctly

## Test Results Documentation

For each test scenario:

1. Record actual vs expected behavior
2. Note any UI/UX issues
3. Document any bugs or inconsistencies
4. Capture screenshots of issues

## Critical Success Criteria

- All core MVP features functional
- No blocking bugs in critical paths
- Basic security measures working
- Performance acceptable on standard hardware

## Known Limitations

- Advanced features disabled
- Basic UI/UX only
- Limited data validation
- Simple error handling

## Next Steps

- [ ] Document test results
- [ ] Prioritize bug fixes
- [ ] Plan UX improvements
- [ ] Schedule follow-up testing
