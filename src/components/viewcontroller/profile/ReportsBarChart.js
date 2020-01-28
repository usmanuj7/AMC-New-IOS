  // import React from 'react'
  // import { View } from 'react-native'
  // import { BarChart, Grid } from 'react-native-svg-charts'
  // import { Text } from 'react-native-svg'
  // import { array, number,  } from 'prop-types'

  // class ReportsBarChart extends React.PureComponent {

  //     render() {

  //         const data =this.props.data
  //         if(Number.isNaN(data[0]) )
  //         {
  //             return (
  //                 <View>
                    
  //                 </View>
  //             )
  //         }
  //         else{
  //         const CUT_OFF = 20
  //         const Labels = ({ x, y, bandwidth, data }) => (
  //             data.map((value, index) => (
  //                 <Text
  //                     key={ index }
  //                     x={ x(index) + (bandwidth / 2) }
  //                     y={ value < CUT_OFF ? y(value) - 10 : y(value) + 15 }
  //                     fontSize={ 14 }
  //                     fill={ value >= CUT_OFF ? 'white' : 'black' }
  //                     alignmentBaseline={ 'middle' }
  //                     textAnchor={ 'middle' }
  //                 >
  //                      {parseFloat(value* 100).toFixed(2) +"%"}
  //                 </Text>
  //             ))
  //         )

  //         return (
  //             <View style={{ flexDirection: 'row', height: 200, paddingVertical: 16 }}>
  //                 <BarChart
  //                     style={{ flex: 1 }}
  //                     data={data}
  //                     svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
  //                     contentInset={{ top: 20, bottom: 10 }}
  //                     spacing={0.2}
  //                     gridMin={0}
  //                 >
  //                     <Grid direction={Grid.Direction.HORIZONTAL}/>
  //                     <Labels/>
  //                 </BarChart>
  //             </View>
  //         )
  //         }
  //     }

  // }

  // ReportsBarChart.propTypes = {
      
  //     data: array.isRequired,
  //     total : number.isRequired
  // }
  // export default ReportsBarChart
  /*Example of React Native Chart Kit*/
  import * as React from 'react';
  //import React
  import { Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
  //import Basic React Native Components

  import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart,
  } from 'react-native-chart-kit';
  //import React Native chart Kit for different kind of Chart

  export default class ReportsBarChart extends React.Component {
    render() {
      const data =this.props.data
      

      if(this.props.data.length>0)
      {
        
        var found = false;
        for(var i = 0; i < data.length; i++) {
          if(data[i][0]===0&&data[i][1]===0)
          {
            found = false
          }
          else
          {
            found = true;
            break
          }
        }
        if(found===true)
        {
          return (
            <ScrollView horizontal={true}>
              <View style={styles.container}>
                <View>
          <Text style={{textAlign:'center'}}>{this.props.chartYear}</Text>
                  <StackedBarChart
                    data={{
                      labels: this.props.labelArray,
                    legend: ['Break', 'Worked'],
                      data: this.props.data,
                      barColors: ['red', 'green'],
                    }}
                    width={Dimensions.get('window').width}
                    height={180}
                    chartConfig={{
                      padding:20,
                      backgroundColor: '#1cc910',
                      backgroundGradientFrom: '#eff3ff',
                      backgroundGradientTo: '#efefef',
                      decimalPlaces: 2,
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: {
                      //   borderRadius: 16,
                      },
                    }}
                    
                    style={{
                      // marginVertical: 8,
                      // borderRadius: 16,
                    }}
                  >
                  
                    </StackedBarChart>
                  
                </View>
              </View>
            </ScrollView>
          );
        }
        else{
          return (
        
            <View>
          
              
            </View>
        
      );
        }
        
      }
      else
      return (
        
            <View>
          
              
            </View>
        
      );
    
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 8,
      paddingTop: 30,
      backgroundColor: '#ecf0f1',
    },
  });
