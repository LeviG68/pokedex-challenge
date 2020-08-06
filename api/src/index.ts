import { IResolvers } from 'apollo-server'
import { Pokemon } from '../schema/interfaces'
import { checkExists, isMatch, sortById } from '../lib'
import pokemon from '../pokemon.json'
import find from 'lodash/find'
import filter from 'lodash/filter'

const baseResolvers: IResolvers<any, any> = {
  Pokemon: {
    prevEvolutions(rawPokemon: Pokemon) {
      return (
        rawPokemon.prevEvolutions?.map(evolution =>
          find(pokemon, otherPokemon => otherPokemon.num === evolution.num)
        ) || []
      )
    },
    nextEvolutions(rawPokemon: Pokemon) {
      return (
        rawPokemon.nextEvolutions?.map(evolution =>
          find(pokemon, otherPokemon => otherPokemon.num === evolution.num)
        ) || []
      )
    },
  },

  Query: {
    pokemonMany(
      _,
      {
        typeFilters = [],
        weaknessFilters = [],
        skip = 0,
        limit = 999,
      }: {
        typeFilters?: string[]
        weaknessFilters?: string[]
        skip?: number
        limit?: number
      }
    ): Pokemon[] {
      const isProvided = {
        typeFilters: checkExists(typeFilters),
        weaknessFilters: checkExists(weaknessFilters),
      }

      const applyFilters = (poke: Pokemon) => {
        let typesMatch: boolean = isMatch(poke.types, typeFilters)
        let weaknessesMatch: boolean = isMatch(poke.weaknesses, weaknessFilters)

        if (isProvided.typeFilters && isProvided.weaknessFilters) {
          return typesMatch && weaknessesMatch
        }

        if (isProvided.typeFilters) {
          return typesMatch
        } else {
          return weaknessesMatch
        }
      }

      return filter(pokemon, applyFilters) // apply any type/weakness filters that are provided
        .concat() // copy the array to prevent mutating while sorting
        .sort(sortById) // sort remaining pokemon by their 'id' property
        .slice(skip, limit + skip)
    },

    pokemonOne(_, { id }: { id: string }): Pokemon {
      return (pokemon as Record<string, Pokemon>)[id]
    },
  },
}

export default baseResolvers
