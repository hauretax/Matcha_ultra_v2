import React, { createContext, useState, useCallback, useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

type SnackbarContextType = {
	(message: string, severity: "error" | "warning" | "info" | "success"): void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

function SnackBarProvider({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [severity, setSeverity] = useState<"error" | "warning" | "info" | "success">("success");

	const openSnackbar: SnackbarContextType = useCallback((message, severity) => {
		setMessage(message);
		setSeverity(severity);
		setOpen(true);
	}, []);

	const closeSnackbar = useCallback(() => {
		setOpen(false);
	}, []);

	return (
		<SnackbarContext.Provider value={openSnackbar}>
			{children}
			<Snackbar
				open={open}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
				autoHideDuration={6000}
				onClose={closeSnackbar}
				action={
					<IconButton
						size="small"
						aria-label="close"
						color="inherit"
						onClick={closeSnackbar}
					>
						<CloseIcon fontSize="small" />
					</IconButton>
				}
			>
				<Alert onClose={closeSnackbar} severity={severity} variant="filled">
					{message}
				</Alert>
			</Snackbar>
		</SnackbarContext.Provider>
	);
}

export const useSnackbar = (): SnackbarContextType => {
	const context = useContext(SnackbarContext);

	if (!context) {
		throw new Error("useSnackbar must be used within a SnackBarProvider");
	}

	return context;
};


export default SnackBarProvider;
