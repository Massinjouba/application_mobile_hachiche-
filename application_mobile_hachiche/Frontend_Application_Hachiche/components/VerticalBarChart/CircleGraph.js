import React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { Text as SVGText } from 'react-native-svg';

const CircleGraph = ({ active, inactive }) => {
  const data = [
    {
      key: 1,
      amount: active,
      svg: { fill: '#4CAF50' },
      label: 'Actives',
    },
    {
      key: 2,
      amount: inactive,
      svg: { fill: '#F44336' },
      label: 'Inactives',
    },
  ];

  const Labels = ({ slices }) => {
    return slices.map((slice, index) => {
      const { pieCentroid, data } = slice;
      return (
        <SVGText
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill="white"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={14}
          stroke="black"
          strokeWidth={0.2}
        >
          {data.amount}
        </SVGText>
      );
    });
  };

  return (
    <View style={{ height: 200 }}>
      <PieChart
        style={{ height: 200 }}
        valueAccessor={({ item }) => item.amount}
        data={data}
        outerRadius="95%"
        innerRadius="40%"
      >
        <Labels />
      </PieChart>
      <Text style={styles.customText}>jhffdjkfhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhjhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh</Text>
    </View>

  );
};

const styles = StyleSheet.create({
    customText: {
        color: 'transparent' // Remplacez '#FF5733' par la couleur souhaitée
    },
  });

export default CircleGraph;
