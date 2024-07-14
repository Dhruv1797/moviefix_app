import React, { useEffect, useState, useRef } from 'react';
import { View, Text, SectionList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

const HomeScreen = () => {
  const [moviebyyear, setmoviebyyear] = useState({});
  const [year, setyear] = useState(2012);
  const [loading, setloading] = useState(false);
  const [isfetchingmore, setisfetchingmore] = useState(false);
  const [genres, setgenres] = useState([]);
  const [selectedgenre, setselectedgenre] = useState(null);
  const sectionlistref = useRef(null);

  useEffect(() => {
    fetchgenres();
    fetchmovies(year);
  }, [year]);

  useEffect(() => {
    fetchmovies(year);
  }, [selectedgenre]);

  const fetchgenres = async () => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5Y2Y2NDM5MDliYTJmNDIzYWNjNDEyYjJmMDFhMWY3ZiIsIm5iZiI6MTcyMDY3Nzg3NS4xMTUyMzgsInN1YiI6IjY2NTE3MGQ4ZmY0OWFkZTZhYzk2MDdhMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gj-F4NtN-etACZIQIEASDIw9EhxwAjU_eBbxnfGOcc0'
        }
      });
      setgenres(response.data.genres);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchmovies = async (year) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        params: {
          api_key: '2dca580c2a14b55200e784d157207b4d',
          sort_by: 'popularity.desc',
          primary_release_year: year,
          vote_count_gte: 100,
          with_genres: selectedgenre ? selectedgenre.toString() : ''
        }
      });
      setmoviebyyear((prev) => ({
        ...prev,
        [year]: response.data.results
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
      setTimeout(() => {
        setisfetchingmore(false);
      }, 1000);
    }
  };

  const rendermovieitem = ({ item, index, section }) => {
    const rowIndex = Math.floor(index / 2);
    if (index % 2 === 0) {
      return (
        <View style={styles.movieRow}>
          <View style={styles.movieCard}>
            <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.movieImage} />
            <Text style={styles.movieTitle}>{item.title}</Text>
            <Text style={styles.movieDescription}>{item.overview}</Text>
          </View>
          {section.data[index + 1] && (
            <View style={styles.movieCard}>
              <Image source={{ uri: `https://image.tmdb.org/t/p/w500${section.data[index + 1].poster_path}` }} style={styles.movieImage} />
              <Text style={styles.movieTitle}>{section.data[index + 1].title}</Text>
              <Text style={styles.movieDescription}>{section.data[index + 1].overview}</Text>
            </View>
          )}
        </View>
      );
    }
    return null;
  };

  const renderfooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  };

  const rendergenrefilters = () => (
    <View style={styles.genresContainer}>
      <Text style={styles.filterHeader}>Filter by Genre:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genresList}>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre.id}
            style={[styles.genreButton, selectedgenre === genre.id && styles.selectedgenreButton]}
            onPress={() => setselectedgenre(selectedgenre === genre.id ? null : genre.id)}
          >
            <Text style={styles.genreButtonText}>{genre.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const sections = Object.keys(moviebyyear).map((year) => ({
    title: `Movies of ${year}`,
    data: moviebyyear[year]
  }));

  return (
    <View style={styles.container}>
      {rendergenrefilters()}
      <SectionList
        ref={sectionlistref}
        sections={sections}
        renderItem={rendermovieitem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => {
          if (!isfetchingmore) {
            setisfetchingmore(true);
            setloading(true);
            setTimeout(() => {
              setyear((prev) => prev + 1);
            }, 2000);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderfooter}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  movieRow: {
    width: 410,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  movieCard: {
    flex: 1,
    marginBottom: 16,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 8,
  },
  movieImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  movieDescription: {
    maxHeight: 150,
    fontSize: 14,
    color: '#aaa',
  },
  footer: {
    paddingVertical: 20,
  },
  genresContainer: {
    marginBottom: 16,
  },
  filterHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  genresList: {
    flexDirection: 'row',
  },
  genreButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#333',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedgenreButton: {
    backgroundColor: '#ff6347',
  },
  genreButtonText: {
    color: '#fff',
  },
});

export default HomeScreen;
