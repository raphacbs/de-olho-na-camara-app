import React, { useEffect, useRef } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Animated,
    ActivityIndicator,
    Text,
} from 'react-native';
import {loadingImage} from "@/assets/stateLoading";

const FiscalizaLoading = ({ message = "Carregando..." }) => {
    // Valor inicial da escala para a animação
    const scaleValue = useRef(new Animated.Value(1)).current;
    const opacityValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Configuração da animação em loop (Pulse Effect)
        Animated.loop(
            Animated.sequence([
                // Aumenta suavemente
                Animated.parallel([
                    Animated.timing(scaleValue, {
                        toValue: 1.1, // Cresce 10%
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityValue, {
                        toValue: 0.8,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
                // Diminui suavemente
                Animated.parallel([
                    Animated.timing(scaleValue, {
                        toValue: 1, // Volta ao tamanho original
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityValue, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
            ])
        ).start();
    }, [scaleValue, opacityValue]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        transform: [{ scale: scaleValue }],
                        opacity: opacityValue,
                    },
                ]}
            >
                <Image
                    source={loadingImage}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>

            {/* Spinner nativo abaixo da logo (Opcional) */}
            <View style={styles.indicatorContainer}>
                <ActivityIndicator size="large" color="#003399" />
                {/* Usei um azul escuro inspirado na logo, mas pode trocar a cor */}

                {message && <Text style={styles.text}>{message}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5', // Um cinza bem claro para destacar o ícone
    },
    logoContainer: {
        marginBottom: 30, // Espaço entre a logo e o spinner
        // Sombras suaves para dar destaque (estilo iOS/Android elevation)
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5.46,
        elevation: 9,
    },
    logo: {
        width: 150, // Ajuste o tamanho conforme necessário
        height: 150,
        borderRadius: 25, // Arredonda as bordas para combinar com o ícone do app
    },
    indicatorContainer: {
        alignItems: 'center',
        gap: 10, // Espaçamento entre o spinner e o texto
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
        fontWeight: '600',
    },
});

export default FiscalizaLoading;