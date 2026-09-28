import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';
import { Provider } from '@/store/layersStore';
import StoreInitializer from '@/components/StoreInitializer';
import Home from '@/pages/Home';
import Scalability from '@/pages/Scalability';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #fafafa;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

const Nav = styled.nav`
  background: #fff;
  border-bottom: 2px solid #e0e0e0;
  padding: 16px 24px;
  display: flex;
  gap: 24px;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
  }

  &.active {
    background: #4caf50;
    color: white;
  }
`;

function App() {
  return (
    <Provider>
      <StoreInitializer>
        <GlobalStyle />
        <BrowserRouter>
          <Nav>
            <NavLink to="/">Основное приложение</NavLink>
            <NavLink to="/scalability">Масштабируемость</NavLink>
          </Nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scalability" element={<Scalability />} />
          </Routes>
        </BrowserRouter>
      </StoreInitializer>
    </Provider>
  );
}

export default App;
