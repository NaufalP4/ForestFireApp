import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

export default function RiwayatRisikoScreen() {
  const router = useRouter();
  const [chartData, setChartData] = React.useState<number[]>(new Array(12).fill(0));
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('http://192.168.87.234:3000/api/zona')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.zona)) {
          const counts = new Array(12).fill(0);
          data.zona.forEach((z: any) => {
            const date = new Date(z.tanggal);
            const monthIndex = date.getMonth(); // 0–11
            counts[monthIndex]++;
          });
          setChartData(counts);
        }
      })
      .catch((err) => {
        console.error('❌ Gagal ambil data riwayat:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  const chart = {
    labels,
    datasets: [
      {
        data: chartData,
        color: (opacity = 1) => `rgba(226, 43, 29, ${opacity})`, // merah
        strokeWidth: 2,
      },
    ],
    legend: ['Jumlah Kebakaran'],
  };

  return (
    <LinearGradient colors={['#FB9E3A', '#D5451B']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Riwayat Risiko</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Red Card */}
      <View style={styles.redCard}>
        <Text style={styles.redCardText}>Riwayat Risiko Kebakaran</Text>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        {loading ? (
          <ActivityIndicator color="#E22B1D" size="large" />
        ) : (
          <LineChart
            data={chart}
            width={Dimensions.get('window').width - 40}
            height={280}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
            withInnerLines
            withOuterLines={false}
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(226, 43, 29, ${opacity})`,
              labelColor: () => '#000',
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#E22B1D',
                fill: '#E22B1D',
              },
              propsForBackgroundLines: {
                stroke: '#f3c4c4',
                strokeDasharray: '4 4',
              },
            }}
            bezier
            fromZero
            style={{ borderRadius: 16 }}
          />
        )}
      </View>

      {/* Search & Filter
      <View style={styles.searchContainer}>
        <TextInput placeholder="Search" placeholderTextColor="#aaa" style={styles.searchInput} />
        <Feather name="filter" size={20} color="#000" />
      </View> */}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 50,
    backgroundColor: '#FB9E3A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  redCard: {
    backgroundColor: '#E22B1D',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  redCardText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
  },
  // searchContainer: {
  //   flexDirection: 'row',
  //   backgroundColor: '#fff',
  //   borderRadius: 50,
  //   paddingHorizontal: 20,
  //   alignItems: 'center',
  //   marginTop: 20,
  //   height: 40,
  //   justifyContent: 'space-between',
  // },
  searchInput: {
    flex: 1,
    marginRight: 10,
    height: 40,
  },
});
