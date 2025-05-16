import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
    Alert,
} from 'react-native';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const Register = () => {
    const { register } = useAuth();
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePickPhoto = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled && result.assets.length > 0) {
                const image = result.assets[0];
                // Preparing the image file for upload
                setProfilePhoto({
                    uri: image.uri,
                    name: image.fileName || 'profile.jpg',
                    type: image.type || 'image/jpeg',
                    size: image.fileSize || 100000,
                });
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleRegister = async () => {
        setError('');
        setLoading(true);

        try {
            if (profilePhoto) {
                await register({
                    name,
                    email,
                    password,
                    profilePhoto, // Pass profile photo to the register function
                });
            } else {
                // Register without profile photo
                await register({
                    name,
                    email,
                    password,
                });
            }
            router.push('/(tabs)/profile');
        } catch (err: any) {
            // More detailed error handling
            const errorMessage = err?.message || 'Registration failed';
            setError(errorMessage);
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Register</Text>

            <TouchableOpacity onPress={handlePickPhoto} style={styles.imagePicker}>
                <Image
                    source={
                        profilePhoto
                            ? { uri: profilePhoto.uri }
                            : require('@/assets/images/image.png')
                    }
                    style={styles.image}
                />
                <Text style={styles.changeText}>Choose Photo</Text>
            </TouchableOpacity>

            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
                onPress={handleRegister}
                style={styles.button}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    imagePicker: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    changeText: {
        marginTop: 8,
        color: '#007AFF',
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    error: {
        color: 'red',
        marginBottom: 8,
        textAlign: 'center',
    },
});
