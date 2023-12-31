'use client'

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Hero, SearchBar, CustomFilter, CarCard, ShowMore } from "@/components";
import { fetchCars } from "@/utils";
import { fuels, yearsOfProduction } from "@/constants";

export default /*async*/ function Home(/*{searchParams}*/) {

  // const allCars = await fetchCars({
  //   manufacturer: searchParams.manufacturer || '',
  //   year: searchParams.year || 2022,
  //   fuel: searchParams.fuel || '',
  //   limit: searchParams.limit || 10,
  //   model: searchParams.model || '',
  // })

  const ref = useRef(null)
  
  const [allCars, setAllCars] = useState([])
  const [loading, setLoading] = useState(false)

  // serach states
  const [manufacturer, setManufacturer] = useState("")
  const [model, setModel] = useState("")

  // filter states
  const [fuel, setFuel] = useState("")
  const [year, setYear] = useState(2022)

  //pagination states
  const [limit, setLimit] = useState(10)


  const getCars = async () =>{
    setLoading(true)
    try {
      const result = await fetchCars({
        manufacturer: manufacturer || '',
        year: year || 2022,
        fuel: fuel || '',
        limit: limit || 10,
        model: model || '',
      })

      setAllCars(result)

    } catch (error) {
      console.log(error)
    } finally{
      setLoading(false)
    }
    
  }

  const handleScrollClick = () =>{
    ref.current?.scrollIntoView({behavior: 'smooth'});
  }

  useEffect(() => {
    console.log(fuel, year, limit, manufacturer, model)
    getCars()
  }, [fuel, year, limit, manufacturer, model])
  


  return (
    <main className="overflow-hidden">
      <Hero scrollTo={handleScrollClick}/>

      <div className="mt-12 padding-x padding-y max-width" id="discover" ref={ref}>
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">
            Car Catalogue
          </h1>
          <p>Explore the cars you might like</p>
        </div>

        <div className="home__filters">
          <SearchBar setManufacturer={setManufacturer} setModel={setModel}/>

          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} setFilter={setFuel}/>
            <CustomFilter title="year" options={yearsOfProduction} setFilter={setYear}/>
          </div>
        </div>

        {/*!isDataEmpty?*/ allCars.length > 0 ?
          (
            <section>
              <div className="home__cars-wrapper">
                {allCars?.map((car) => (
                  <CarCard car={car}/>
                ))}
              </div>

              {loading && (
                <div className="mt-16 w-full flex-center">
                  <Image
                    src='/loader.svg'
                    alt='loader'
                    width={50}
                    height={50}
                    className="object-contain"
                  />
                </div>
              )}

              <ShowMore
                pageNumber = {/*(limit || 10)/10*/ limit/10}
                isNext = {/*(limit || 10)*/ limit > allCars.length}
                setLimit={setLimit}
              />
            </section>
          ):(
            <div className="home__error-container">
              <h2 className="text-black text-xl font-bold">Opps, no results</h2>
              <p>{allCars?.message}</p>
            </div>
          )
        }

      </div>
    </main>
  )
}
