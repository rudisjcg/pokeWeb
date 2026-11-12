"use client";

import { motion } from "framer-motion";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { styles } from "@/lib/constants";
import { fadeIn, textVariant } from "@/lib/motion";
import type { PokemonSummary } from "@/lib/pokeapi.types";
import { strings } from "@/lib/strings";
import PokemonCard from "./PokemonCard";
import Tilt from "./Tilt";

export default function FeaturedCarousel({ pokemons }: { pokemons: PokemonSummary[] }) {
  return (
    <>
      <motion.div className="w-auto h-auto" variants={textVariant()}>
        <h2 className={`${styles.sectionHeadText} text-center mb-10`}>{strings.home.featured}</h2>
      </motion.div>
      <motion.div
        variants={fadeIn("right", "spring", 0, 0.75)}
        className={`${styles.paddingX} m-auto p-[1px] rounded-[20px] flex flex-col items-center mb-20`}
      >
        <div className="container">
          <div className="swiperContainer">
            <Swiper
              modules={[Pagination, Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ el: ".pagination", clickable: true }}
              slidesPerView={4}
              breakpoints={{
                "@0.00": { slidesPerView: 1, spaceBetween: 25 },
                "@0.50": { slidesPerView: 1, spaceBetween: 25 },
                "@1.00": { slidesPerView: 2, spaceBetween: 25 },
                "@1.25": { slidesPerView: 2, spaceBetween: 20 },
                "@1.50": { slidesPerView: 3, spaceBetween: 30 },
                "@1.75": { slidesPerView: 4, spaceBetween: 30 },
              }}
            >
              {pokemons.map((pokemon) => (
                <SwiperSlide className="flex" key={pokemon.id}>
                  <Tilt>
                    <PokemonCard pokemon={pokemon} />
                  </Tilt>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </motion.div>
    </>
  );
}
