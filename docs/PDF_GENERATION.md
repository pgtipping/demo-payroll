# PDF Generation Documentation

## Components

### PayslipPDF

A React component that generates a single payslip PDF using `@react-pdf/renderer`.

```typescript
interface PayslipData {
  employeeId: string;
  employeeName: string;
  period: string;
  grossSalary: number;
  deductions: {
    tax: number;
    healthInsurance: number;
    pension: number;
    other?: number;
  };
  netSalary: number;
  currency: string;
  generatedAt: Date;
}
```

Usage:

```tsx
<PayslipPDF data={payslipData} />
```

### BatchPayslipDownload

A component that handles batch generation of multiple payslips with progress tracking and error handling.

Features:

- Progress indicator
- Error handling
- Loading states
- Success notifications

Usage:

```tsx
<BatchPayslipDownload payslips={payslipsArray} period="January 2024" />
```

## Implementation Details

### Styling

- Uses custom styles defined in StyleSheet
- Consistent with application theme
- Responsive layout for different paper sizes

### Error Handling

- Graceful fallback for preview failures
- Clear error messages
- Alternative download option when preview fails

### Loading States

- Visual feedback during generation
- Progress tracking for batch operations
- Disabled states to prevent multiple generations

## Best Practices

1. **Memory Management**

   - Generate PDFs on-demand
   - Clean up resources after generation
   - Use streaming for large batches

2. **Error Prevention**

   - Validate data before generation
   - Handle missing or invalid data gracefully
   - Provide clear error messages

3. **Performance**
   - Lazy load PDF components
   - Use web workers for large batches
   - Implement caching where appropriate

## Known Limitations

1. Font loading may fail in offline mode
2. Large batches may be memory intensive
3. Preview may not work in some mobile browsers

## Future Improvements

1. Add caching for generated PDFs
2. Implement background processing for large batches
3. Add more customization options for layouts
4. Support for custom templates
