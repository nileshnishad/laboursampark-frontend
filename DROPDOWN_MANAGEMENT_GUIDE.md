# Dropdown Management Guide

## Overview
All dropdown lists for the application are now centrally managed in a single JSON file to ensure consistency and make updates globally. This eliminates hardcoded dropdown values scattered throughout the codebase.

## File Location
- **Data file**: `data/dropdowns.json`

## Structure

The `dropdowns.json` file is organized by user type with the following structure:

```json
{
  "contractor": {
    "businessTypes": [...],
    "servicesOffered": [...],
    "teamSize": [...],
    "experienceRange": [...],
    "coverageArea": [...]
  },
  "labour": {
    "skills": [...],
    "workType": [...],
    "workingHours": [...],
    "experienceRange": [...]
  },
  "common": {
    "experienceRange": [...]
  }
}
```

## Dropdown Lists

### Contractor Dropdowns
- **businessTypes**: Types of construction/service businesses
- **servicesOffered**: Types of services contractors offer
- **teamSize**: Team size categories
- **experienceRange**: Years of experience ranges
- **coverageArea**: Geographic coverage areas

### Labour Dropdowns
- **skills**: Trade skills available to workers
- **workType**: Types of work arrangements
- **workingHours**: Preferred working hour options
- **experienceRange**: Years of experience ranges

### Common Dropdowns
- **experienceRange**: Shared experience ranges used across both contractor and labour

## How to Use in Components

### Importing the Data
```typescript
import dropdownsData from "@/data/dropdowns.json";
```

### For Contractor Form
```typescript
const { 
  businessTypes: BUSINESS_TYPES, 
  servicesOffered: SERVICES_OPTIONS, 
  teamSize: TEAM_SIZE, 
  experienceRange: EXPERIENCE_RANGE, 
  coverageArea: COVERAGE_AREA 
} = dropdownsData.contractor;
```

### For Labour Form
```typescript
const { 
  skills: SKILLS_OPTIONS, 
  workType: WORK_TYPES, 
  workingHours: WORKING_HOURS, 
  experienceRange: EXPERIENCE_RANGE 
} = dropdownsData.labour;
```

### Using in JSX
```typescript
// Simple dropdown
<select>
  <option>Select an option</option>
  {BUSINESS_TYPES.map((type) => (
    <option key={type} value={type}>
      {type}
    </option>
  ))}
</select>

// Button-based multi-select
<div className="grid grid-cols-2 gap-2">
  {SKILLS_OPTIONS.map((skill) => (
    <button
      key={skill}
      type="button"
      onClick={() => toggleSkill(skill)}
      className={`px-3 py-2 rounded-lg ${
        selectedSkills.includes(skill)
          ? "bg-blue-600 text-white"
          : "bg-gray-100"
      }`}
    >
      {skill}
    </button>
  ))}
</div>
```

## How to Update Dropdowns

### Adding a New Option
1. Open `data/dropdowns.json`
2. Add the new option to the appropriate array
3. The change will automatically reflect in all components using that dropdown

Example: Adding a new business type
```json
"businessTypes": [
  "Construction",
  "Renovation",
  ...
  "Solar Installation"  // New option
]
```

### Removing an Option
1. Open `data/dropdowns.json`
2. Remove the option from the array
3. The change will automatically reflect everywhere

### Reordering Options
1. Open `data/dropdowns.json`
2. Reorder the items in the array as needed
3. The new order will display in all forms

## Benefits of This Approach

✅ **Single Source of Truth**: All dropdowns managed in one place  
✅ **Easy Updates**: Change once, applies everywhere globally  
✅ **Consistency**: Same values used across the application  
✅ **Maintainability**: No need to search through multiple files  
✅ **Scalability**: Easy to add new dropdowns or options  
✅ **Type Safety**: Can be extended with TypeScript interfaces for validation  

## Future Enhancements

Consider these improvements for the future:

1. Add a `description` field for each option:
   ```json
   {
     "id": "construction",
     "label": "Construction",
     "description": "Building and infrastructure projects"
   }
   ```

2. Create a utility hook for easier usage:
   ```typescript
   const useDropdowns = (type: 'contractor' | 'labour') => {
     return dropdownsData[type];
   };
   ```

3. Add dynamic loading from an API instead of static JSON:
   ```typescript
   const dropdownsData = await fetch('/api/dropdowns');
   ```

4. Add validation schema to ensure dropdown values:
   ```typescript
   const dropdownSchema = z.object({
     businessType: z.enum(dropdownsData.contractor.businessTypes),
   });
   ```

## Files Using Dropdowns

- `app/register/ContractorRegisterForm.tsx` - Uses contractor dropdowns
- `app/register/LabourRegisterForm.tsx` - Uses labour dropdowns

To add dropdowns to new components, follow the import and usage patterns shown above.
