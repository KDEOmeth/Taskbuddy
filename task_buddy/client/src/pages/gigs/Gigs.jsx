import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef(null);
  const maxRef = useRef(null);

  const { search } = useLocation();

  const fetchGigs = async () => {
    const queryParams = new URLSearchParams(search);
    const min = minRef.current?.value ? minRef.current.value : undefined;
    const max = maxRef.current?.value ? maxRef.current.value : undefined;

    if (min !== undefined) queryParams.set("min", min);
    if (max !== undefined) queryParams.set("max", max);
    queryParams.set("sort", sort);

    const response = await newRequest.get(`/gigs?${queryParams.toString()}`);
    return response.data;
  };

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", search, sort],
    queryFn: fetchGigs,
    refetchOnWindowFocus: false,
  });

  console.log(data);

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  const apply = () => {
    refetch();
  };

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">Task_Buddy day-to-day services </span>
        <h1>day-to-day services</h1>
        <p>Experience the convenience and reliability of Task_Buddy's day-to-day services, where our dedicated professionals ensure your everyday tasks are handled with care and efficiency.</p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "loading"
            : error
            ? "Something went wrong!"
            : data?.map((gig) => <GigCard key={gig._id} item={gig} />)}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
