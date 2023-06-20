import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

function MyLink({ children, to, variant }: { children: JSX.Element | string, to: string, variant?: any }) {
    return (
        <Link component={RouterLink} to={to} variant={variant}>
            {children}
        </Link>
    )
}

export default MyLink