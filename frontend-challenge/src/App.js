import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Coin from "./Coin";
import Pagination from "./Pagination";

function App() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=aud&order=market_cap_desc&per_page=100&page=1&sparkline=false");
        setCoins(res.data);
        setLoading(false);
      } catch {
        alert("Error has occured!");
      }
    };
    fetchData();
  }, []);
  //console.log(coins);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  // Get current coins
  const lastCoins = currentPage * coinsPerPage;
  const firstCoins = lastCoins - coinsPerPage;
  const currentCoins = coins.slice(firstCoins, lastCoins);

  // Filter coins based on names in search bar.
  const filteredCoins = currentCoins.filter(
    (coin) =>
      coin.name.toLowerCase().indexOf(search.toLowerCase()) >= 0 ||
      coin.symbol.toLowerCase().indexOf(search.toLowerCase()) >= 0
  );

  //All coins

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // TODO sort symbol and beautify project
  if (loading) {
    return <h2>Page is being loaded...</h2>;
  }

  return (
    <div className="frontend-app">
      <div className="search-bar">
        <h1 className="bar-name"> Search currency</h1>
        <form>
          <input
            type="text"
            placeholder="Search"
            className="coin-input"
            onChange={handleChange}
          />
        </form>
      </div>
      <div className="coin-header">
        <p className="header-1">--</p>
        <p className="header-2">Name</p>
        <p className="header-3">Symbol</p>
        <p className="header-4">Price</p>
        <p className="header-5">Volume</p>
        <p className="header-6">Price Change</p>
        <p className="header-7">Market cap</p>
      </div>
      {filteredCoins.map((coins) => {
        return (
          <Coin
            key={coins.id}
            name={coins.name}
            image={coins.image}
            symbol={coins.symbol}
            marketcap={coins.market_cap}
            price={coins.current_price}
            priceChange={coins.price_change_percentage_24h}
            volume={coins.total_volume}
          />
        );
      })}
      <br />
      <br />
      <Pagination
        coinsPerpage={coinsPerPage}
        totalCoins={coins.length}
        paginate={paginate}
      />
    </div>
  );
}
export default App;