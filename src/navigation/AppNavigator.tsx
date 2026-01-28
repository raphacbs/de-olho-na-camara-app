import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {useAuth} from '@/contexts/AuthContext';
import {RootTabs} from './RootTabs';
import {LoginScreen} from '@/screens/LoginScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/types/navigation';
import {PoliticianDetailsScreen} from '@/screens/PoliticianDetailsScreen';
import {PoliticianPropositionsScreen} from '@/screens/PoliticianPropositionsScreen';
import {PoliticianExpensesScreen} from '@/screens/PoliticianExpensesScreen';
import {DeputadosSeguidosScreen} from '@/screens/DeputadosSeguidosScreen';
import {ProposalDetailScreen} from '@/screens/ProposalDetailScreen';
import {PoliticianVotesScreen} from '@/screens/PoliticianVotesScreen';
import {DeputadosScreen} from "@/screens/DeputadosScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
    const {isAuthenticated, isLoading} = useAuth();

    // Mostrar loading enquanto verifica autenticação
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#009C3B"/>
            </View>
        );
    }

    // Mostrar tela de login se não estiver autenticado
    if (!isAuthenticated) {
        return <LoginScreen/>;
    }

    // Mostrar app principal se estiver autenticado
    return (
        <Stack.Navigator
            screenOptions={{
                headerBackTitle: 'Voltar',
                headerTintColor: '#009C3B',
            }}
        >
            <Stack.Screen name="MainTabs" component={RootTabs} options={{headerShown: false}}/>
            <Stack.Screen
                name="PoliticianDetails"
                component={PoliticianDetailsScreen}
                options={{
                    headerShown: true,
                    title: 'Detalhes do Deputado',
                }}
            />
            <Stack.Screen
                name="PoliticianPropositions"
                component={PoliticianPropositionsScreen}
                options={{
                    headerShown: true,
                    title: 'Propostas do Deputado',
                }}
            />
            <Stack.Screen
                name="PoliticianExpenses"
                component={PoliticianExpensesScreen}
                options={{
                    headerShown: true,
                    title: 'Despesas do Deputado',
                }}
            />
            <Stack.Screen
                name="PoliticianVotes"
                component={PoliticianVotesScreen}
                options={{
                    headerShown: true,
                    title: 'Votos do Deputado',
                }}
            />
            <Stack.Screen
                name="DeputadosSeguidos"
                component={DeputadosSeguidosScreen}
                options={{
                    headerShown: true,
                    title: 'Deputados Seguidos',
                }}
            />
            <Stack.Navigator>
                <Stack.Screen
                    name="PoliticianList"
                    component={DeputadosScreen}
                    options={{
                        headerShown: true,
                        title: 'Deputados',
                    }}
                />
            </Stack.Navigator>
            <Stack.Screen
                name="ProposalDetail"
                component={ProposalDetailScreen}
                options={{
                    headerShown: true,
                    title: 'Detalhes da Proposta',
                }}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
});
