// import { router, useLocalSearchParams } from 'expo-router'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import {
//     Image,
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
//     Text,
//     TouchableOpacity,
//     useColorScheme,
//     View,
// } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import {
//     useEditProductMutation,
//     useGetProductByIdQuery,
// } from '@/services/productsService'
// import { useGetCategoryQuery } from '@/services/categoryService'
// import { getFileFromUriAsync, getFilesFromUris } from '@/utils/getFileFromUriAsync'
// import * as ImagePicker from 'expo-image-picker'
// import FormField from '@/components/FormField'
// import Ionicons from '@expo/vector-icons/Ionicons'
// import { Picker } from '@react-native-picker/picker'
// import { BASE_URL } from '@/constants/Urls'
// import { IEditProduct } from '@/interfaces/Product/Product'
//
// interface Category {
//     id: number
//     name: string
// }
//
// interface ImageData {
//     uri: string
//     id: string
// }
//
// const EditProductScreen = () => {
//     const { id } = useLocalSearchParams()
//     const colorScheme = useColorScheme()
//
//     const { data: product, isLoading: productLoading, refetch } =
//         useGetProductByIdQuery(Number(id), {
//             skip: !id,
//         })
//     const { data: categories } = useGetCategoryQuery()
//     const [editProduct, { isLoading }] = useEditProductMutation()
//
//     const [form, setForm] = useState({
//         name: '',
//         price: '',
//         description: '',
//         categoryId: 0,
//     })
//
//     const [images, setImages] = useState<ImageData[]>([])
//     const [originalImages, setOriginalImages] = useState<string[]>([])
//
//     const [formError, setFormError] = useState({
//         name: { error: false, message: '' },
//         price: { error: false, message: '' },
//         description: { error: false, message: '' },
//         categoryId: { error: false, message: '' },
//         image: { error: false, message: '' },
//     })
//
//     useEffect(() => {
//         if (id) refetch()
//     }, [id, refetch])
//
//     useEffect(() => {
//         if (product) {
//             setForm({
//                 name: product.name,
//                 price: product.price.toString() ?? '',
//                 description: product.description ?? '',
//                 categoryId: product.categoryId,
//             })
//
//             const urls =
//                 product.imageUrls?.map(
//                     (url) => `${BASE_URL}/uploading/1200_${url}`
//                 ) ?? []
//
//             setImages(
//                 urls.map((uri) => ({
//                     uri,
//                     id: Math.random().toString(36).substring(2),
//                 }))
//             )
//             setOriginalImages(urls)
//         }
//     }, [product])
//
//     const handleChange = (
//         field: keyof typeof form,
//         value: string | number
//     ) => {
//         setForm((prev) => ({ ...prev, [field]: value }))
//         if (
//             value.toString().trim() !== '' &&
//             (field !== 'categoryId' || value !== 0)
//         ) {
//             handleFormError(field, false, '')
//         }
//     }
//
//     const handleFormError = (
//         field: keyof typeof formError,
//         error: boolean,
//         message = ''
//     ) => {
//         setFormError((prev) => ({
//             ...prev,
//             [field]: { error, message },
//         }))
//     }
//
//     const validateForm = (): boolean => {
//         let errorCount = 0
//
//         if (!form.name) {
//             handleFormError('name', true, 'Name is required')
//             errorCount++
//         }
//
//         if (
//             !form.price ||
//             isNaN(Number(form.price)) ||
//             Number(form.price) <= 0
//         ) {
//             handleFormError('price', true, 'Valid price is required')
//             errorCount++
//         }
//
//         if (!form.description) {
//             handleFormError('description', true, 'Description is required')
//             errorCount++
//         }
//
//         if (!form.categoryId) {
//             handleFormError('categoryId', true, 'Category is required')
//             errorCount++
//         }
//
//         if (images.length === 0) {
//             handleFormError('image', true, 'At least one image is required')
//             errorCount++
//         }
//
//         return errorCount === 0
//     }
//
//     const pickImage = async () => {
//         const permissionResult =
//             await ImagePicker.requestMediaLibraryPermissionsAsync()
//         if (!permissionResult.granted) {
//             alert('To select a photo, please allow access to your files')
//             return
//         }
//
//         const result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 1,
//         })
//
//         if (!result.canceled) {
//             setImages((prev) => [
//                 ...prev,
//                 {
//                     uri: result.assets[0].uri,
//                     id: Math.random().toString(36).substring(2),
//                 },
//             ])
//             handleFormError('image', false, '')
//         }
//     }
//
//     const removeImage = (id: string) => {
//         setImages((prev) => prev.filter((img) => img.id !== id))
//     }
//
//     const handleEdit = async () => {
//         if (!validateForm()) return
//
//         try {
//             const payload: IEditProduct = {
//                 id: Number(id),
//                 name: form.name,
//                 description: form.description,
//                 price: Number(form.price),
//                 categoryId: form.categoryId,
//                 images: [],
//             }
//
//             // Prepare all images (new and existing)
//             const imagePromises = images.map(async (img) => {
//                 if (originalImages.includes(img.uri)) {
//                     // Existing image: Use the URL directly or fetch as a File if required by backend
//                     const response = await fetch(img.uri)
//                     const blob = await response.blob()
//                     return new File([blob], `image-${img.id}.jpg`, {
//                         type: blob.type || 'image/jpeg',
//                     })
//                 } else {
//                     // New image: Convert URI to File
//                     return await getFileFromUriAsync(img.uri)
//                 }
//             })
//
//             // Resolve all image promises
//             const files = await Promise.all(imagePromises)
//             //@ts-ignore
//             payload.images = files
//
//             await editProduct(payload).unwrap()
//             router.replace('/products')
//         } catch (error) {
//             console.log('--Error updating product--', error)
//             alert('Error editing product')
//         }
//     }
//
//     if (productLoading) {
//         return (
//             <SafeAreaView className="flex-1 justify-center items-center">
//                 <Text>Loading product...</Text>
//             </SafeAreaView>
//         )
//     }
//
//     return (
//         <SafeAreaView className="flex-1">
//             <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//                 style={{ flex: 1 }}
//             >
//                 <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//                     <View className="w-full flex justify-center items-center px-6 gap-2">
//                         <FormField
//                             title="Name"
//                             value={form.name}
//                             placeholder="Enter product name"
//                             handleChangeText={(value) =>
//                                 handleChange('name', value)
//                             }
//                             keyboardType="default"
//                             autoCapitalize="none"
//                             error={formError.name.error}
//                             errorMessage={formError.name.message}
//                         />
//
//                         <FormField
//                             title="Price"
//                             value={form.price}
//                             placeholder="Enter price"
//                             handleChangeText={(value) =>
//                                 handleChange('price', value)
//                             }
//                             keyboardType="numeric"
//                             autoCapitalize="none"
//                             error={formError.price.error}
//                             errorMessage={formError.price.message}
//                         />
//
//                         <FormField
//                             title="Description"
//                             value={form.description}
//                             placeholder="Enter description"
//                             handleChangeText={(value) =>
//                                 handleChange('description', value)
//                             }
//                             keyboardType="default"
//                             autoCapitalize="none"
//                             error={formError.description.error}
//                             errorMessage={formError.description.message}
//                         />
//
//                         <View className="w-full mt-4">
//                             <Text className="text-base font-medium mb-2">
//                                 Category
//                             </Text>
//                             <View
//                                 className={`w-full border-2 rounded-lg ${
//                                     formError.categoryId.error
//                                         ? 'border-red-500'
//                                         : 'border-gray-300 dark:border-gray-600'
//                                 }`}
//                             >
//                                 <Picker
//                                     selectedValue={form.categoryId}
//                                     onValueChange={(value) =>
//                                         handleChange('categoryId', value)
//                                     }
//                                     style={{
//                                         color:
//                                             colorScheme === 'dark'
//                                                 ? '#fff'
//                                                 : '#000',
//                                         backgroundColor:
//                                             colorScheme === 'dark'
//                                                 ? '#1f2937'
//                                                 : '#fff',
//                                     }}
//                                 >
//                                     <Picker.Item
//                                         label="Select a category"
//                                         value={0}
//                                     />
//                                     {categories?.map((category: Category) => (
//                                         <Picker.Item
//                                             key={category.id}
//                                             label={category.name}
//                                             value={category.id}
//                                         />
//                                     ))}
//                                 </Picker>
//                             </View>
//                             {formError.categoryId.error && (
//                                 <Text className="text-red-500 text-sm mt-1">
//                                     {formError.categoryId.message}
//                                 </Text>
//                             )}
//                         </View>
//
//                         <View className="w-full flex items-center justify-center mt-6 mb-2">
//                             <TouchableOpacity
//                                 onPress={pickImage}
//                                 className="w-32 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4"
//                             >
//                                 <Text className="text-base font-medium text-gray-700 dark:text-gray-200">
//                                     Add Photo
//                                 </Text>
//                             </TouchableOpacity>
//
//                             <View className="flex-row flex-wrap justify-center gap-2">
//                                 {images.map((img) => (
//                                     <View key={img.id} className="relative">
//                                         <Image
//                                             source={{ uri: img.uri }}
//                                             className="w-24 h-24 rounded-lg"
//                                         />
//                                         <TouchableOpacity
//                                             onPress={() => removeImage(img.id)}
//                                             className="absolute top-1 right-1 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center"
//                                         >
//                                             <Ionicons
//                                                 name="close"
//                                                 size={16}
//                                                 color="#fff"
//                                             />
//                                         </TouchableOpacity>
//                                     </View>
//                                 ))}
//                             </View>
//
//                             {formError.image.error && (
//                                 <Text className="text-red-500 text-sm mt-2">
//                                     {formError.image.message}
//                                 </Text>
//                             )}
//                         </View>
//
//                         <TouchableOpacity
//                             onPress={handleEdit}
//                             className="w-full rounded-lg mt-4 px-4 py-3 bg-black dark:bg-white"
//                         >
//                             <Text className="text-white dark:text-black text-center text-base font-medium">
//                                 Save changes
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         </SafeAreaView>
//     )
// }
//
// export default EditProductScreen
