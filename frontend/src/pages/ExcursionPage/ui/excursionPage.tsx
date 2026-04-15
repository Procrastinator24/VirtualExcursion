import { useEffect, useRef, useState } from 'react'
import { sceneApi, ModelScene } from "@entities/scene";
import {
    Engine,
    Scene as BabylonScene,
    FreeCamera,
    FlyCamera,
    Vector3,
    HemisphericLight,
    SceneLoader,
} from '@babylonjs/core';
import '@babylonjs/loaders';

export function ExcursionPage(){
    const [sceneData, setSceneData] = useState<ModelScene | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        sceneApi.getSceneById(1).then(data => {
            console.log("Данные сцены:", data);
            setSceneData(data);
        });
    }, []);

    useEffect(() => {
        if (!canvasRef.current || !sceneData?.modelUrl) {
            console.log("Нет canvas или данных");
            return;
        }

        const canvas = canvasRef.current;
        const engine = new Engine(canvas, true);
        const scene = new BabylonScene(engine);

        // Камера и свет
        //const camera = new FreeCamera("camera", new Vector3(0, 2, -8), scene);
        const camera = new FlyCamera("FlyCamera", new Vector3(0, 5, -10), scene);
        //camera.setTarget(Vector3.Zero());
        camera.attachControl(canvas, true);

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        // Загрузка модели
        const loadModel = async () => {
            try {
                console.log("Загрузка модели:", sceneData.modelUrl);

                //  Правильный синтаксис: 4 параметра
                const result = await SceneLoader.ImportMeshAsync(
                    "",                          // 1. meshNames (все меши)
                    "",                          // 2. rootUrl (пустая строка)
                    sceneData.modelUrl,          // 3. sceneFilename (полный путь)
                    scene                        // 4. целевая сцена
                );

                console.log("✅ Модель загружена!");
                console.log("Мешей:", result.meshes.length);

                if (result.meshes.length > 0) {
                    const boundingInfo = result.meshes[0].getBoundingInfo();
                    if (boundingInfo) {
                        camera.setTarget(boundingInfo.boundingBox.center);
                    }
                }

            } catch (err) {
                console.error("Ошибка загрузки:", err);
            }
        };

        loadModel();

        engine.runRenderLoop(() => scene.render());
        window.addEventListener("resize", () => engine.resize());

        return () => {
            scene.dispose();
            engine.dispose();
        };
    }, [sceneData]);

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            {sceneData && <h1 style={{ position: "absolute", zIndex: 10 }}>{sceneData.sceneName}</h1>}
            <div style={{width: "60vw", height: "60vh", margin: "10%"}}>
                <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
            </div>
        </div>
    );
}

export default ExcursionPage;