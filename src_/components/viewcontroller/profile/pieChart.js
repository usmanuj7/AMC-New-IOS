import React from 'react'
import {
    ListView,
    View,
    StatusBar,
   
    FlatList,
    StyleSheet,
    Image, Alert,
    ImageBackground,
    TextInput, TouchableOpacity, ScrollView, AsyncStorage, BackHandler
} from 'react-native';
import { PieChart } from 'react-native-svg-charts'
import { Text } from 'react-native-svg'
import { array, number,  } from 'prop-types'

const Labels = ({ slices, height, width, }) => {
    return slices.map((slice, index) => {
        const { labelCentroid, pieCentroid, data } = slice;
        if(data.amount>0 && parseFloat(data.amount * 100).toFixed(2)!=="0.00")
        return (
            <Text
                key={index}
                x={pieCentroid[0]}
                y={pieCentroid[1]}
                fill={'white'}
                textAnchor={'middle'}
                alignmentBaseline={'middle'}
                fontSize={12}
                stroke={'black'}
                strokeWidth={0.2}
            >
                {parseFloat(data.amount * 100).toFixed(2) +"%"}
            </Text>
        )
    })
}

Chart = ({data,total}) =>{
  
    return(
    <PieChart
            style={{ height: 200 }}
            valueAccessor={({ item }) => item.amount}
            data={data}
            spacing={0}
            outerRadius={'95%'}
        >
            <Labels/>
        </PieChart>
)}

Chart.propTypes = {
    
      data: array.isRequired,
      total : number.isRequired
  }
  
  export default Chart
