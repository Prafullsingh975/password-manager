interface PasswordEntry {
  id: string;
  website: string;
  username: string;
  password:  string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}