import React, { ReactNode } from 'react';
import { View, Image, Text } from 'react-native';
import styles from './styles';
import { BorderlessButton } from 'react-native-gesture-handler';

import backIcon from '../../assets/images/icons/back.png';
import logoImg from '../../assets/images/logo.png';
import { useNavigation } from '@react-navigation/native';

interface PageHeaderProps {
    title: string,
    headerRight?: ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = (props) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container} >
            <View style={styles.topBar}>
                <BorderlessButton onPress={() => navigation.navigate("Landing")}>
                    <Image source={backIcon} resizeMode="contain" />
                </BorderlessButton>

                <Image source={logoImg} resizeMode="contain" />
            </View>

            <View style={styles.header}>
                <Text style={styles.title}>{props.title}</Text>

                {props.headerRight}
            </View>

            {props.children}
        </View>
    );
}

export default PageHeader;