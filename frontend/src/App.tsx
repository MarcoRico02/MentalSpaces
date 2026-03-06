import { AuthProvider } from "./core/aplicacion/contexto/AuthContext";
import { ReactQueryProvider } from "./core/aplicacion/contexto/ReactQueryProvider";
import { ThemeProvider } from "./core/aplicacion/contexto/ThemeContext";
import { AppRoutes } from "./routes";

function App() {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}

export default App;
