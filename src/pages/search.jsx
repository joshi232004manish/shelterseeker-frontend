import React, { useEffect } from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Card from "../components/card";

function search() {
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      try {
        const searchQuery = urlParams.toString();
        console.log(searchQuery);
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        setListings(data);
        console.log(data);
        if (data.length > 8) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = async (e) => {
    if (
      e.target.id == "parking" ||
      e.target.id == "furnished" ||
      e.target.id == "offer"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]: e.target.checked === true ? true : false,
      });
    }
    if (e.target.id === "searchTerm") {
      setSideBarData({
        ...sideBarData,
        [e.target.id]: e.target.value,
      });
    }
    if (
      e.target.id === "rent" ||
      e.target.id === "all" ||
      e.target.id === "sell"
    ) {
      setSideBarData({
        ...sideBarData,
        type: e.target.id,
      });
    }
    if (e.target.id == "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";

      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({
        ...sideBarData,
        sort,
        order,
      });
    }
    console.log(sideBarData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.set(
      "searchTerm",
      sideBarData.searchTerm
    );
    const typeFromUrl = urlParams.set("type", sideBarData.type);
    const parkingFromUrl = urlParams.set("parking", sideBarData.parking);
    const furnishedFromUrl = urlParams.set("furnished", sideBarData.furnished);
    const offerFromUrl = urlParams.set("offer", sideBarData.offer);
    const sortFromUrl = urlParams.set("sort", sideBarData.sort);
    const orderFromUrl = urlParams.set("order", sideBarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search/?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row gap-14 text-2xl ">
      <div className="flex flex-col gap-6 m-8 ">
        <div className="flex flex-row gap-4">
          <h2>Search Term :</h2>
          <input
            id="searchTerm"
            onChange={handleChange}
            value={sideBarData.searchTerm}
            type="text"
          />
        </div>
        <div className="flex flex-row gap-3">
          <h2>Type :</h2>
          <div className="flex gap-2">
            <input
              onChange={handleChange}
              checked={sideBarData.type === "all"}
              type="checkbox"
              name=""
              id="all"
            />
            <span>Rent & Sell</span>
          </div>
          <div className="flex gap-2">
            <input
              onChange={handleChange}
              checked={sideBarData.type === "rent"}
              type="checkbox"
              name=""
              id="rent"
            />
            <span>Rent</span>
          </div>
          <div className="flex gap-2">
            <input
              onChange={handleChange}
              checked={sideBarData.type === "sell"}
              type="checkbox"
              name=""
              id="sell"
            />
            <span>Sell</span>
          </div>
          <div className="flex gap-2">
            <input
              onChange={handleChange}
              checked={sideBarData.offer}
              type="checkbox"
              name=""
              id="offer"
            />
            <span>Offer</span>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <h2 className="my-auto">Amenities :</h2>
          <div className="flex gap-2 ">
            <input
              onChange={handleChange}
              checked={sideBarData.parking}
              type="checkbox"
              name=""
              id="parking"
            />
            <span className="my-auto">Parking</span>
          </div>
          <div className="flex gap-2">
            <input
              onChange={handleChange}
              checked={sideBarData.furnished}
              type="checkbox"
              name=""
              id="furnished"
            />
            <span className="my-auto">Furnished</span>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <h2>Sort :</h2>
          <select
            onChange={handleChange}
            defaultValue={"createdAt_desc"}
            name=""
            id="sort_order"
          >
            <option value="regularPrice_desc">Price high to low</option>
            <option value="regularPrice_asc">Price low to hight</option>
            <option value="createdAt_desc">Latest</option>
            <option value="createdAt_asc">Oldest</option>
          </select>
        </div>
        <div>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 w-[100%] text-2xl uppercase rounded-2xl py-2"
          >
            Search
          </button>
        </div>
      </div>
      <div>
        <h2 className="font-semibold text-3xl my-5 ">Listing Results :</h2>
        <div>
          {!loading && listings.length === 0 && <div>No Listing Found</div>}
          {loading && <div>Loading...</div>}
          <div className="flex flex-row flex-wrap gap-10">
            {!loading &&
              listings &&
              listings.map((listing) => (
                <Card key={listing._id} listing={listing} />
              ))}

            {showMore && (
              <button
                onClick={onShowMoreClick}
                className="text-green-700 hover:underline p-7 text-center w-full"
              >
                Show more
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default search;
