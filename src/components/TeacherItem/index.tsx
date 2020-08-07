import React, { useState } from 'react';
import { View, Image, Text, Linking } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png';
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png';
import whatsappIcon from '../../assets/images/icons/whatsapp.png';

import styles from './styles';
import api from '../../services/api';

export interface Teacher {
    id: number
    name: string
    avatar: string
    bio: string
    cost: number
    subject: string
    whatsapp: string
}

interface TeacherItemProps {
    teacher: Teacher,
    favorited: boolean
}

const TeacherItem: React.FC<TeacherItemProps> = (props) => {
    const [isFavorited, setIsFavorited] = useState<boolean>(props.favorited);

    function handleLinkingToWhatsapp() {
        Linking.openURL(`whatsapp://send?phone=+55${props.teacher.whatsapp}`);

        api.post(`/connections`, {
            user_id: props.teacher.id
        })
    }

    async function handleToggleFavorite() {
        const favorites = await AsyncStorage.getItem('favorites');
        let favoritesArray: Array<Teacher> = [];

        if (favorites) {
            favoritesArray = JSON.parse(favorites);
        }

        if (isFavorited) {
            favoritesArray = favoritesArray.filter(item => item.id != props.teacher.id);

            setIsFavorited(false);
            await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
        } else {

            favoritesArray.push(props.teacher);

            setIsFavorited(true);
            await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <Image
                    style={styles.avatar}
                    source={{
                        uri: props.teacher.avatar
                    }}
                />

                <View style={styles.profileInfo}>
                    <Text style={styles.name}>{props.teacher.name}</Text>
                    <Text style={styles.subject}>{props.teacher.subject}</Text>
                </View>
            </View>

            <Text style={styles.bio}>
                {props.teacher.bio}
            </Text>

            <View style={styles.footer}>
                <Text style={styles.price}>
                    Preço/hora {'   '}
                    <Text style={styles.priceValue}>R$ {props.teacher.cost}</Text>
                </Text>

                <View style={styles.buttonsContainer}>
                    <RectButton onPress={handleToggleFavorite} style={[styles.favoriteButton, isFavorited ? styles.favorited : null]}>
                        {!isFavorited ?
                            <Image source={heartOutlineIcon} />
                            :
                            <Image source={unfavoriteIcon} />
                        }
                    </RectButton>

                    <RectButton onPress={handleLinkingToWhatsapp} style={styles.contactButton}>
                        <Image source={whatsappIcon} />
                        <Text style={styles.contactButtonText}>Entrar em contato</Text>
                    </RectButton>

                </View>
            </View>
        </View>
    );
}

export default TeacherItem;