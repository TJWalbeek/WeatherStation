import pandas as pd
import numpy as np
#import mysql.connectorimport sqlite3
import mysql.connector
import os.path

#conn = sqlite3.connect("WeatherDataBase.db")
#df = pd.read_sql_query("select * from Locations", conn)

connection = mysql.connector.connect(host='localhost',
                                     database='WeatherDataBase',
                                     user='website',
                                     password='readonlysql')

df = pd.read_sql_query('''SELECT DateTime, Sources.`SourceName`, Locations.`LocationName`, Measures.`MeasureType`, Value from EnvironmentalData
                        join Sources on Sources.SourceID = EnvironmentalData.Source
                        join Locations on Locations.LocationsID = EnvironmentalData.Location
                        join Measures on Measures.MeasureTypeID = EnvironmentalData.Measurement
                        order by DateTime;''', connection)
df2 = df.copy()[df['MeasureType'] == "light"]
df2['DateTime'] = pd.to_datetime(df2['DateTime'])
df2['Time'] = df2['DateTime'].dt.round("30 min").dt.time

months = np.unique(df2['DateTime'].dt.to_period('M'))

for mon in months:
    #name = str(mon) + '.csv'
    name = 'MonthlyData/' + str(mon) + '.csv'
    #print(name)
    if mon != months[-1]:
        if not os.path.exists(name):
            df3 = df2.copy()[df2['DateTime'].dt.to_period('M') == mon]
            summary = df3.groupby(['LocationName','MeasureType','SourceName','Time']).agg({'Value':['mean','std']})
            summary.columns = ["_".join(x) for x in summary.columns.ravel()]
            summary['Month'] = mon
            summary.to_csv(name)
            print(mon)
    else :
        df3 = df2.copy()[df2['DateTime'].dt.to_period('M') == mon]
        summary = df3.groupby(['LocationName','MeasureType','SourceName','Time']).agg({'Value':['mean','std']})
        summary.columns = ["_".join(x) for x in summary.columns.ravel()]
        summary['Month'] = mon
        summary.to_csv(name)
        print(mon)


connection.close()
