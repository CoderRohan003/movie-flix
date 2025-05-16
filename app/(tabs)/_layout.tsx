import { ImageBackground, Image, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'

const TabIcon = ({ focused, icon, title }: any) => {
    if (focused) {
        const shiftIcon = title !== 'Home' ? -6 : 4;

        return (
            <ImageBackground
                source={images.highlight}
                className="flex flex-row items-center justify-center min-w-[112px] min-h-14 mt-6 rounded-full overflow-hidden px-4"
            >
                <View className="flex-row items-center" style={{ transform: [{ translateX: shiftIcon }] }}>
                    <Image source={icon} className="size-5" style={{ tintColor: '#151312' }} />
                    <Text className="text-secondary text-base font-semibold ml-2">{title}</Text>
                </View>
            </ImageBackground>
        );
    }

    return (
        <View className="size-full justify-center items-center mt-4 rounded-full">
            <Image source={icon} tintColor="#A8B5DB" className="size-5" />
        </View>
    );
};


const _layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarStyle: {
                    backgroundColor: '#0f0d23',
                    borderRadius: 50,
                    marginHorizontal: 12,
                    marginBottom: 50,
                    height: 50,
                    position: 'absolute',
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: '#0f0d23',
                }
            }}
        >
            <Tabs.Screen name='index' options={{
                title: 'Home',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon
                        focused={focused}
                        icon={icons.home}
                        title='Home'
                    />
                )
            }} />
            <Tabs.Screen name='search' options={{
                title: 'Search',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon
                        focused={focused}
                        icon={icons.search}
                        title='Search'
                    />
                )
            }} />
            <Tabs.Screen name='saved' options={{
                title: 'Saved',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon
                        focused={focused}
                        icon={icons.save}
                        title='Saved'
                    />
                )
            }} />
            <Tabs.Screen name='profile' options={{
                title: 'Profile',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon
                        focused={focused}
                        icon={icons.person}
                        title='Profile'
                    />
                )
            }} />
        </Tabs>
    )
}

export default _layout