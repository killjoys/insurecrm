interface StatusBadgeProps {
  label: string;
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple' | 'orange';
}

const variantClasses: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  yellow: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  gray: 'bg-gray-50 text-gray-700 ring-gray-600/20',
  purple: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  orange: 'bg-orange-50 text-orange-700 ring-orange-600/20',
};

export default function StatusBadge({ label, variant = 'gray' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}

export function getPolicyStatusVariant(status: string): StatusBadgeProps['variant'] {
  switch (status) {
    case 'Inforced': return 'green';
    case 'Pending': return 'yellow';
    case 'Lapsed': return 'red';
    case 'Cancelled': return 'gray';
    case 'Matured': return 'blue';
    default: return 'gray';
  }
}

export function getLeadStageVariant(stage: string): StatusBadgeProps['variant'] {
  switch (stage) {
    case 'New': return 'blue';
    case 'Contacted': return 'yellow';
    case 'Quoted': return 'purple';
    case 'Closed': return 'green';
    default: return 'gray';
  }
}

export function getTicketPriorityVariant(priority: string): StatusBadgeProps['variant'] {
  switch (priority) {
    case 'Urgent': return 'red';
    case 'High': return 'orange';
    case 'Medium': return 'yellow';
    case 'Low': return 'gray';
    default: return 'gray';
  }
}

export function getTicketStatusVariant(status: string): StatusBadgeProps['variant'] {
  switch (status) {
    case 'Open': return 'blue';
    case 'In Progress': return 'yellow';
    case 'Resolved': return 'green';
    case 'Closed': return 'gray';
    default: return 'gray';
  }
}
