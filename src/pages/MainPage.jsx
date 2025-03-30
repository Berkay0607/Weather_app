import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./MainPage.css"; // CSS dosyasını import ediyoruz

const MainPage = () => {
  const [city, setCity] = useState(""); // Kullanıcının girdiği şehir adı
  const [weatherData, setWeatherData] = useState(null); // Hava durumu verisi
  const [temperature, setTemperature] = useState(null); // Sıcaklık verisi
  const [errorMessage, setErrorMessage] = useState(""); // Hata mesajı
  const [loading, setLoading] = useState(false); // Yükleniyor durumu
  const navigate = useNavigate(); // Kullanıcıyı yönlendirmek için
  const { city: urlCity } = useParams(); // URL parametrelerinden şehir adı

  // Hava durumu ve sıcaklık verilerini çeken fonksiyon
  const getWeatherData = async (cityName) => {
    setLoading(true); // İstek yapıldığında yükleniyor durumunu başlat
    try {
      const weatherResponse = await fetch(`https://wttr.in/${cityName}?format=%C`);
      
      if (weatherResponse.status === 404 || !weatherResponse.ok) {
        throw new Error("Şehir bulunamadı. Lütfen geçerli bir şehir adı girin.");
      }

      const weatherData = await weatherResponse.text();
      setWeatherData(weatherData);

      // Sıcaklık verisini almak için
      const tempResponse = await fetch(`https://wttr.in/${cityName}?format=%t`);
      const tempData = await tempResponse.text();
      setTemperature(tempData);

      setErrorMessage(""); // Eğer her şey doğruysa, hata mesajını temizle
    } catch (error) {
      setWeatherData(null);
      setTemperature(null);
      setErrorMessage(error.message); // Hata durumunda, hata mesajını ayarla
    } finally {
      setLoading(false); // İstek tamamlandığında yükleniyor durumunu sonlandır
    }
  };

  // URL parametresinde şehir adı varsa, bu değeri al ve güncelle
  useEffect(() => {
    if (urlCity) {
      setCity(urlCity); // URL parametresindeki şehir ismini state'e atıyoruz
      getWeatherData(urlCity); // Şehir ismiyle hava durumu verisini al
    }
  }, [urlCity]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (city) {
      navigate(`/${city}`); // Şehri URL'ye ekleyerek yeni bir rota oluştur
      getWeatherData(city); // Yeni şehir için verileri getir
    }
  };

  return (
    <div className="container">
      <h1 className="title">Hava Durumu</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Şehir adı girin..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="input"
        />
        <button type="submit" className="button">
          Ara
        </button>
      </form>

      {/* Hata mesajını göster */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Yükleniyor göstergesi */}
      {loading && <div className="loading">Yükleniyor...</div>}

      {/* Hava durumu ve sıcaklık bilgisi */}
      {weatherData && (
        <div className="weather-info">
          <div className="weather-data">{weatherData}</div>
          {temperature && <div className="temperature">Sıcaklık: {temperature}°C</div>}
        </div>
      )}
    </div>
  );
};

export default MainPage;
