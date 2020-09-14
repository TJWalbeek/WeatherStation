import pandas as pd
#import numpy as np
import mysql.connector
#import os.path

connection = mysql.connector.connect(host='localhost',
                                     database='WeatherDataBase',
                                     user='website',
                                     password='readonlysql')

df = pd.read_sql_query('''SELECT DateTime, Sources.`SourceName`, Locations.`LocationName`, Measures.`MeasureType`, Value from EnvironmentalData
                        join Sources on Sources.SourceID = EnvironmentalData.Source
                        join Locations on Locations.LocationsID = EnvironmentalData.Location
                        join Measures on Measures.MeasureTypeID = EnvironmentalData.Measurement
                        order by DateTime;''', connection)
df.to_csv('FullDatabase.csv')


connection.close()
