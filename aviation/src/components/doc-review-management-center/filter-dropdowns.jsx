import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const domains = ["Finance", "HR", "IT", "Marketing", "Operations", "Legal"]
const departments = {
  Finance: ["Accounting", "Budgeting", "Payroll", "Tax"],
  HR: ["Recruitment", "Training", "Benefits", "Employee Relations"],
  IT: ["Development", "Infrastructure", "Support", "Security"],
  Marketing: ["Digital", "Content", "Brand", "Analytics"],
  Operations: ["Logistics", "Production", "Quality", "Facilities"],
  Legal: ["Compliance", "Contracts", "Intellectual Property", "Litigation"],
}
const categories = ["Policies", "Reports", "Forms", "Procedures", "Guidelines", "Templates"]

export function FilterDropdowns() {
  const [selectedDomain, setSelectedDomain] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const handleDomainChange = (value) => {
    setSelectedDomain(value)
    setSelectedDepartment("") // Reset department when domain changes
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Select value={selectedDomain} onValueChange={handleDomainChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Domain" />
          </SelectTrigger>
          <SelectContent>
            {domains.map((domain) => (
              <SelectItem key={domain} value={domain}>
                {domain}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment} disabled={!selectedDomain}>
          <SelectTrigger>
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            {selectedDomain &&
              departments[selectedDomain]?.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select Document Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}