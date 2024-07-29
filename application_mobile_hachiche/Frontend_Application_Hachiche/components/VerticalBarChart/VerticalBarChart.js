import React from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { BarChart } from 'react-native-svg-charts';
import { G, Line } from 'react-native-svg';

const VerticalBarChart = ({ stock, capacity }) => {
  // Calcul du stockage restant
  const remaining = capacity - stock;

  // Texte à afficher en haut
  const titre = `${stock} plantules et ${remaining} stockage restant`;

  // Données pour le graphique
  const data = [
    {
      value: stock,
      svg: { fill: 'green' },
      key: 'stock', // Utilisation d'une clé unique
    },
    {
      value: remaining,
      svg: { fill: 'red' },
      key: 'remaining', // Utilisation d'une clé unique
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>{titre}</Text>
      <BarChart
        style={{ height: 200, width: Dimensions.get('window').width - 50 }}
        data={data}
        yAccessor={({ item }) => item.value}
        contentInset={{ top: 10, bottom: 10 }}
        spacingInner={0.4}
        spacingOuter={0.2}
        gridMin={0}
      >
        {/* Optionnel : Ligne de base */}
        <G>
          <Line
            x1="0%"
            x2="100%"
            y1="0"
            y2="0"
            stroke="black"
            strokeWidth={1}
          />
        </G>
      </BarChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  titre: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#F3F7E8',
  },
});

export default VerticalBarChart;
