import { AuthProvider } from "./core/aplicacion/contexto/AuthContext";
import { ReactQueryProvider } from "./core/aplicacion/contexto/ReactQueryProvider";
import { AppRoutes } from "./routes";

function App() {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ReactQueryProvider>
  );
}

export default App;
