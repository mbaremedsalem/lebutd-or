import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import HallDetailPage from './pages/HallDetailPage';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <div className="app">
          <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/salles/:id" element={<HallDetailPage />} />
          </Routes>
        </main>
        </div>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;