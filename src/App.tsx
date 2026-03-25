import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "antd";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            background: "#001529",
            display: "flex",
            alignItems: "center",
            paddingInline: 50,
          }}
        >
          <h1
            style={{
              color: "#fff",
              margin: 0,
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            Product Manager
          </h1>
        </Header>

        <Content style={{ padding: "24px 50px" }}>
          <Routes>
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/" element={<Navigate to="/products" replace />} />
          </Routes>
        </Content>

        <Footer style={{ textAlign: "center", marginTop: "auto" }}>
          JavaScript Engineer Task Roxnor (March 2026)
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
