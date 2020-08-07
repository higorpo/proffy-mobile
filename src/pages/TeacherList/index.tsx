import React, { useState, FormEvent, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';

const TeacherList: React.FC = () => {
    const [isFiltersVisible, setIsFiltersVisible] = useState<boolean>(true);
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);

    const [subject, setSubject] = useState('Educação Física');
    const [weekDay, setWeekDay] = useState('Terça-feira');
    const [time, setTime] = useState('13:00');

    useFocusEffect(() => {
        loadFavorites();
    })

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => teacher.id)
                setFavorites(favoritedTeachersIds);
            }
        })
    }

    async function handleSearchTeachers() {
        loadFavorites();

        let weekDayNumber = 0;

        switch (weekDay) {
            case 'Domingo':
                weekDayNumber = 0;
                break;
            case 'Segunda-feira':
                weekDayNumber = 1;
                break;
            case 'Terça-feira':
                weekDayNumber = 2;
                break;
            case 'Quarta-feira':
                weekDayNumber = 3;
                break;
            case 'Quinta-feira':
                weekDayNumber = 4;
                break;
            case 'Sexta-feira':
                weekDayNumber = 5;
                break;
            case 'Sábado':
                weekDayNumber = 6;
                break;
        }

        try {
            const response = await api.get('/classes', {
                params: {
                    subject,
                    week_day: weekDayNumber,
                    time
                }
            })

            console.log(response.data);

            setTeachers(response.data);
            setIsFiltersVisible(false);
        } catch (err) {
            console.log(err);
        }
    }

    function handleToggleFiltersVisible() {
        setIsFiltersVisible(!isFiltersVisible);
    }

    return (
        <View style={styles.container}>
            <PageHeader
                title="Proffys disponíveis"
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name="filter" size={20} color="#fff" />
                    </BorderlessButton>
                )}
            >
                {isFiltersVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Qual a matéria?"
                            placeholderTextColor="#c1bccc"
                            value={subject}
                            onChangeText={text => setSubject(text)}
                        />
                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Qual o dia?"
                                    placeholderTextColor="#c1bccc"
                                    value={weekDay}
                                    onChangeText={text => setWeekDay(text)}
                                />
                            </View>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Qual horário?"
                                    placeholderTextColor="#c1bccc"
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                />
                            </View>
                        </View>

                        <RectButton onPress={handleSearchTeachers} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>

            <ScrollView style={styles.teacherList} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                {teachers.map((teacher: Teacher) => (
                    <TeacherItem
                        key={teacher.id}
                        teacher={teacher}
                        favorited={favorites.includes(teacher.id)}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

export default TeacherList;