import { getStatusColor } from '../../utils/helpers';

const StatusBadge = ({ status, className = '' }) => (
  <span className={`status-badge ${getStatusColor(status)} ${className}`}>{status}</span>
);

export default StatusBadge;
