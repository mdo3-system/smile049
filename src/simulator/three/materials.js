/**
 * 3Dシミュレーター用マテリアルファクトリ (Simulator Materials)
 * 
 * 【単一責任の原則 (SRP)】
 * - 外壁ガルバリウム鋼板、屋根、土間スラブ、基礎コンクリート、木造フレーム、建具、シースルー透過マテリアルの一元管理
 */

import * as THREE from 'three';

/**
 * シミュレーター描画用のマテリアルセットを生成
 * @param {Object} options
 * @param {boolean} options.isSeeThrough シースルー（透過表示）モードかどうか
 * @returns {Object} マテリアルセット
 */
export function createSimulatorMaterials({ isSeeThrough = false } = {}) {
  return {
    slabMat: new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.8
    }),
    foundationMat: new THREE.MeshStandardMaterial({
      color: 0xc8cbd0,
      roughness: 0.9
    }),
    wallMat: new THREE.MeshStandardMaterial({
      color: 0x3d4a58,
      roughness: 0.45,
      transparent: isSeeThrough,
      opacity: isSeeThrough ? 0.35 : 1.0,
      side: THREE.DoubleSide
    }),
    roofMat: new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.35,
      transparent: isSeeThrough,
      opacity: isSeeThrough ? 0.35 : 1.0
    }),
    ceilingMat: new THREE.MeshStandardMaterial({
      color: 0xeddcc8,
      roughness: 0.6
    }),
    woodMat: new THREE.MeshStandardMaterial({
      color: 0x8c6239,
      roughness: 0.7
    }),
    shutterBoxMat: new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.5,
      roughness: 0.5
    }),
    shutterMat: new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.4,
      roughness: 0.6
    }),
    sashFrameMat: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.25
    }),
    windowGlassMat: new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.08,
      metalness: 0.15,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    }),
    doorFrameMat: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.2
    }),
    doorPanelMat: new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.5,
      metalness: 0.2
    }),
    edgeLineMat: new THREE.LineBasicMaterial({
      color: 0x1e293b,
      linewidth: 1
    }),
    dimLineMat: new THREE.LineBasicMaterial({
      color: 0x0284c7,
      linewidth: 2
    })
  };
}

